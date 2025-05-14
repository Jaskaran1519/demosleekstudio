import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Disable the default body parser to handle raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Read raw body as buffer - improved to handle binary data correctly
const getRawBody = (req: NextApiRequest): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    
    req.on('error', (err) => {
      console.error('[RAZORPAY_WEBHOOK] Error reading request body:', err);
      reject(err);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Immediately send a 200 response to acknowledge receipt of the webhook
  // This prevents Razorpay from retrying and potentially disabling the webhook
  res.status(200).json({ success: true, message: "Webhook received" });
  
  if (req.method !== 'POST') {
    console.error('[RAZORPAY_WEBHOOK] Method not allowed:', req.method);
    return;
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await getRawBody(req);
    
    // Parse the JSON body
    let body;
    try {
      body = JSON.parse(rawBody.toString());
      console.log("[RAZORPAY_WEBHOOK] Received webhook event:", body.event);
    } catch (parseError) {
      console.error("[RAZORPAY_WEBHOOK] Error parsing webhook body:", parseError);
      return; // Already sent 200 response, just exit
    }
    
    const { payload } = body;
    const razorpaySignature = req.headers['x-razorpay-signature'] as string;
    
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("[RAZORPAY_WEBHOOK] Missing webhook secret in environment variables");
    } else if (!razorpaySignature) {
      console.error("[RAZORPAY_WEBHOOK] Missing signature header");
      return; // Already sent 200 response, just exit
    } else {
      // Verify the webhook signature to ensure it's a legitimate request from Razorpay
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      
      if (razorpaySignature !== expectedSignature) {
        console.error("[RAZORPAY_WEBHOOK] Invalid signature");
        console.error(`Expected: ${expectedSignature}`);
        console.error(`Received: ${razorpaySignature}`);
        return; // Already sent 200 response, just exit
      }
    }
    
    // Extract the necessary information from the event
    const event = body.event;
    console.log(`[RAZORPAY_WEBHOOK] Processing ${event} event`);
    
    if (!payload || !payload.payment || !payload.payment.entity) {
      console.error("[RAZORPAY_WEBHOOK] Invalid payload structure");
      return; // Already sent 200 response, just exit
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
          return; // Already sent 200 response, just exit
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
      
      return; // Already sent 200 response, just exit
      
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
      
      return; // Already sent 200 response, just exit
    } else {
      console.log(`[RAZORPAY_WEBHOOK] Unhandled event: ${event}`);
      return; // Already sent 200 response, just exit
    }
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Critical error:", error);
    // Already sent 200 response at the beginning, just log the error
    return;
  }
}
