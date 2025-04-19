import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      items, 
      addressId, 
      couponId,
      couponCode,
      discountAmount,
      subtotal,
      tax,
      shipping,
      total
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!addressId) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    // Verify the address belongs to the user
    const address = await db.address.findUnique({
      where: {
        id: addressId,
        userId: session.user.id
      }
    });

    if (!address) {
      return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
    }

    // Verify coupon if provided
    let validatedCoupon = null;
    if (couponId && couponCode) {
      validatedCoupon = await db.coupon.findUnique({
        where: { 
          id: couponId,
          code: couponCode,
          isActive: true
        }
      });

      if (!validatedCoupon) {
        return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
      }
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        email: session.user.email || '',
      }
    });

    // Create order in database with PENDING status
    console.log("[ORDER_CREATE] Cart items:", JSON.stringify(items));
    
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        total,
        subtotal,
        tax: tax || 0,
        shipping: shipping || 0,
        shippingAddressId: addressId,
        paymentIntent: razorpayOrder.id,
        paymentStatus: "PENDING",
        couponId: validatedCoupon?.id,
        couponCode: validatedCoupon?.code,
        discountAmount: discountAmount || 0,
        items: {
          create: items.map((item: any) => {
            console.log(`[ORDER_CREATE] Processing item: ${item.productId || item.id} (${item.name || 'unnamed'})`);
            return {
              productId: item.productId || item.id,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color,
              totalPrice: item.price * item.quantity
            };
          })
        }
      }
    });
    
    console.log(`[ORDER_CREATE] Order created: ${order.id} with items`);

    // If coupon was used, increment the timesUsed counter
    if (validatedCoupon) {
      await db.coupon.update({
        where: { id: validatedCoupon.id },
        data: {
          timesUsed: {
            increment: 1
          }
        }
      });
    }

    // Return order details and payment info
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
      },
      payment: {
        id: razorpayOrder.id,
        amount: Number(razorpayOrder.amount) / 100, // Convert back to INR from paise
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      }
    });
  } catch (error) {
    console.error("[ORDER_CREATE]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
} 