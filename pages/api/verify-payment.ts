import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      order_id 
    } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification parameters' });
    }

    // Verify the payment signature
    // Try both possible environment variable names for the secret key
    const secret = process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET;
    
    console.log('[VERIFY_PAYMENT] Environment variables available:', {
      RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY ? 'Set' : 'Not set',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set'
    });
    
    if (!secret) {
      console.error('[VERIFY_PAYMENT] Missing Razorpay secret key');
      // Continue without verification in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[VERIFY_PAYMENT] Development mode - proceeding without verification');
      } else {
        return res.status(500).json({ error: 'Server configuration error' });
      }
    }

    // Only verify signature if we have a secret key
    if (secret) {
      // Generate the expected signature
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      // TypeScript fix: Ensure secret is treated as a valid key
      const secretKey: crypto.BinaryLike = secret;
      const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(payload)
        .digest('hex');

      // Verify the signature
      if (expectedSignature !== razorpay_signature) {
        console.error('[VERIFY_PAYMENT] Invalid signature');
        console.error(`Expected: ${expectedSignature}`);
        console.error(`Received: ${razorpay_signature}`);
        
        // In development, proceed anyway for testing
        if (process.env.NODE_ENV !== 'development') {
          return res.status(400).json({ error: 'Invalid payment signature' });
        } else {
          console.log('[VERIFY_PAYMENT] Development mode - proceeding despite signature mismatch');
        }
      } else {
        console.log('[VERIFY_PAYMENT] Signature verified successfully');
      }
    } else {
      console.log('[VERIFY_PAYMENT] Skipping signature verification (no secret key)');
    }

    console.log(`[VERIFY_PAYMENT] Payment verified for order ID: ${order_id}`);

    console.log(`[VERIFY_PAYMENT] Looking for order with ID: ${order_id} and paymentIntent: ${razorpay_order_id}`);
    
    // First try to find by exact match
    let order = await db.order.findFirst({
      where: { 
        id: order_id,
        paymentIntent: razorpay_order_id
      },
      include: {
        coupon: true,
      }
    });
    
    // If not found, try finding just by paymentIntent
    if (!order) {
      console.log(`[VERIFY_PAYMENT] Order not found with exact match, trying by paymentIntent only`);
      order = await db.order.findFirst({
        where: { 
          paymentIntent: razorpay_order_id
        },
        include: {
          coupon: true,
        }
      });
    }

    if (!order) {
      console.error(`[VERIFY_PAYMENT] Order not found: ${order_id}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is already processed
    if (order.paymentStatus === 'PAID') {
      console.log(`[VERIFY_PAYMENT] Order already processed: ${order_id}`);
      return res.status(200).json({ message: 'Order already processed' });
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
        console.error(`[VERIFY_PAYMENT] Error creating coupon usage: ${error}`);
        // Don't fail the whole process for this, just log it
      }
    }

    // Update product inventory and sales count
    try {
      const orderItems = await db.orderItem.findMany({
        where: { orderId: order.id },
        include: { product: true }
      });
      
      console.log(`[VERIFY_PAYMENT] Order items found: ${orderItems.length}`);
      
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
      console.error(`[VERIFY_PAYMENT] Error updating inventory: ${error}`);
      // Log the error but don't fail the verification
    }

    console.log(`[VERIFY_PAYMENT] Successfully processed payment for order: ${order.id}`);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[VERIFY_PAYMENT] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
