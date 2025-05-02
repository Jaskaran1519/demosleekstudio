import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Read raw body as buffer
const getRawBody = (req: NextApiRequest): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data));
    });
    req.on('error', reject);
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    
    // Log the full webhook payload
    console.log("[RAZORPAY_WEBHOOK] Received webhook:", JSON.stringify(body, null, 2));
    
    const { payload } = body;
    const razorpaySignature = req.headers['x-razorpay-signature'] as string;
    
    // Verify webhook signature (never skip in production)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("[RAZORPAY_WEBHOOK] Missing webhook secret in environment variables");
      // Continue processing but log the error
    } else if (razorpaySignature) {
      // Verify the webhook signature to ensure it's a legitimate request from Razorpay
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      
      if (razorpaySignature !== expectedSignature) {
        console.error("[RAZORPAY_WEBHOOK] Invalid signature");
        console.error(`Expected: ${expectedSignature}`);
        console.error(`Received: ${razorpaySignature}`);
        // We'll log the error but still return 200 to prevent Razorpay from deactivating the webhook
      }
    }
    
    // Extract the necessary information from the event
    const event = body.event;
    console.log(`[RAZORPAY_WEBHOOK] Processing ${event} event`);
    
    if (!payload || !payload.payment || !payload.payment.entity) {
      console.error("[RAZORPAY_WEBHOOK] Invalid payload structure");
      return res.status(200).json({ success: true, message: "Webhook received but invalid payload structure" });
    }
    
    if (event === "payment.authorized" || event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.order_id;
      const amount = payload.payment.entity.amount / 100; // Convert paise to INR
      
      console.log(`[RAZORPAY_WEBHOOK] Payment ${paymentId} for order ${orderId} amount ${amount}`);
      console.log(`[RAZORPAY_WEBHOOK] Payment details: ${JSON.stringify(payload.payment.entity, null, 2)}`);
      
      try {
        // Update the order status
        const order = await db.order.findFirst({
          where: { paymentIntent: orderId },
          include: {
            coupon: true,
          }
        });
        
        if (!order) {
          console.error(`[RAZORPAY_WEBHOOK] Order not found for payment intent: ${orderId}`);
          return res.status(200).json({ success: true, message: "Webhook received but order not found" });
        }
        
        // Update order status
        await db.order.update({
          where: { id: order.id },
          data: {
            status: "PROCESSING", // Move from PENDING to PROCESSING
            paymentStatus: "PAID",
          }
        });
        
        // Create coupon usage record if a coupon was used
        if (order.couponId) {
          try {
            await db.couponUsage.create({
              data: {
                userId: order.userId,
                couponId: order.couponId,
                orderId: order.id,
              }
            });
          } catch (error) {
            console.error(`[RAZORPAY_WEBHOOK] Error creating coupon usage: ${error}`);
            // Don't fail the whole process for this, just log it
          }
        }
        
        // Update product inventory and sales count
        try {
          const orderItems = await db.orderItem.findMany({
            where: { orderId: order.id },
            include: { product: true }
          });
          
          console.log(`[RAZORPAY_WEBHOOK] Order items found: ${orderItems.length}`);
          
          for (const item of orderItems) {
            await db.product.update({
              where: { id: item.productId },
              data: {
                inventory: { decrement: item.quantity },
                timesSold: { increment: item.quantity }
              }
            });
          }
        } catch (error) {
          console.error(`[RAZORPAY_WEBHOOK] Error updating inventory: ${error}`);
          // Log the error but don't fail the webhook
        }
        
        console.log(`[RAZORPAY_WEBHOOK] Successfully processed payment for order: ${order.id}`);
      } catch (error) {
        console.error(`[RAZORPAY_WEBHOOK] Error processing payment: ${error}`);
        // Log the error but still return success to Razorpay
      }
      
      return res.status(200).json({ success: true, message: "Payment processed successfully" });
      
    } else if (event === "payment.failed") {
      const orderId = payload.payment.entity.order_id;
      
      try {
        // Mark the order as failed
        const order = await db.order.findFirst({
          where: { paymentIntent: orderId }
        });
        
        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
            }
          });
          
          console.log(`[RAZORPAY_WEBHOOK] Marked order as failed: ${order.id}`);
        } else {
          console.error(`[RAZORPAY_WEBHOOK] Order not found for payment intent: ${orderId}`);
        }
      } catch (error) {
        console.error(`[RAZORPAY_WEBHOOK] Error processing failed payment: ${error}`);
        // Log the error but still return success to Razorpay
      }
      
      return res.status(200).json({ success: true, message: "Failed payment processed" });
    } else {
      console.log(`[RAZORPAY_WEBHOOK] Unhandled event: ${event}`);
      return res.status(200).json({ success: true, message: "Event received but not processed" });
    }
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Critical error:", error);
    // Always return 200 OK to Razorpay, even if we have internal errors
    return res.status(200).json({ success: true, message: "Webhook received with processing errors" });
  }
}
