import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload } = body;
    const razorpaySignature = req.headers.get("x-razorpay-signature") || "";
    
    // Verify webhook signature (never skip in production)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("[RAZORPAY_WEBHOOK] Missing webhook secret in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    // Verify the webhook signature to ensure it's a legitimate request from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");
    
    if (razorpaySignature !== expectedSignature) {
      console.error("[RAZORPAY_WEBHOOK] Invalid signature");
      console.error(`Expected: ${expectedSignature}`);
      console.error(`Received: ${razorpaySignature}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    
    // Extract the necessary information from the event
    const event = body.event;
    console.log(`[RAZORPAY_WEBHOOK] Processing ${event} event`);
    
    if (!payload || !payload.payment || !payload.payment.entity) {
      console.error("[RAZORPAY_WEBHOOK] Invalid payload structure");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    if (event === "payment.authorized" || event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.order_id;
      const amount = payload.payment.entity.amount / 100; // Convert paise to INR
      
      console.log(`[RAZORPAY_WEBHOOK] Payment ${paymentId} for order ${orderId} amount ${amount}`);
      
      // Update the order status
      const order = await db.order.findFirst({
        where: { paymentIntent: orderId },
        include: {
          coupon: true,
        }
      });
      
      if (!order) {
        console.error(`[RAZORPAY_WEBHOOK] Order not found for payment intent: ${orderId}`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
      return NextResponse.json({ success: true, status: "Order updated to PROCESSING" });
      
    } else if (event === "payment.failed") {
      const orderId = payload.payment.entity.order_id;
      
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
        return NextResponse.json({ success: true, status: "Order marked as CANCELLED" });
      } else {
        console.error(`[RAZORPAY_WEBHOOK] Order not found for payment intent: ${orderId}`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } else {
      console.log(`[RAZORPAY_WEBHOOK] Unhandled event: ${event}`);
      return NextResponse.json({ success: true, status: "Event not processed" });
    }
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
} 