import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, cartTotal, items } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    if (!cartTotal || cartTotal <= 0) {
      return NextResponse.json({ error: "Invalid cart total" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Find the coupon
    const coupon = await db.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is inactive" }, { status: 400 });
    }

    // Check date validity
    const now = new Date();
    if (now < coupon.startDate) {
      return NextResponse.json({ error: "This coupon is not yet active" }, { status: 400 });
    }

    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Check if minimum purchase is met
    if (coupon.minimumPurchase && cartTotal < coupon.minimumPurchase) {
      return NextResponse.json({ 
        error: `Minimum purchase of ₹${coupon.minimumPurchase.toFixed(2)} required` 
      }, { status: 400 });
    }

    // Check user-specific restrictions
    // 1. Check if user is excluded
    if (coupon.excludedUserIds.includes(session.user.id)) {
      return NextResponse.json({ error: "This coupon is not available for your account" }, { status: 400 });
    }

    // 2. Check if coupon is restricted to specific users and current user is not in the list
    if (coupon.applicableUserIds.length > 0 && !coupon.applicableUserIds.includes(session.user.id)) {
      return NextResponse.json({ error: "This coupon is not available for your account" }, { status: 400 });
    }

    // 3. Check first-time user restriction
    if (coupon.isFirstTimeOnly) {
      const orderCount = await db.order.count({
        where: {
          userId: session.user.id,
        },
      });

      if (orderCount > 0) {
        return NextResponse.json({ error: "This coupon is for first-time orders only" }, { status: 400 });
      }
    }

    // 4. Check usage limits
    // Total usage limit
    if (coupon.maxUsage && coupon.timesUsed >= coupon.maxUsage) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Per-user usage limit
    if (coupon.maxUsagePerUser) {
      const userUsageCount = await db.couponUsage.count({
        where: {
          userId: session.user.id,
          couponId: coupon.id,
        },
      });

      if (userUsageCount >= coupon.maxUsagePerUser) {
        return NextResponse.json({ 
          error: `You've already used this coupon ${coupon.maxUsagePerUser} time(s)` 
        }, { status: 400 });
      }
    }

    // Single-use coupon check
    if (coupon.isSingleUse) {
      const hasUsed = await db.couponUsage.findFirst({
        where: {
          userId: session.user.id,
          couponId: coupon.id,
        },
      });

      if (hasUsed) {
        return NextResponse.json({ error: "This coupon can only be used once" }, { status: 400 });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      
      // Apply maximum discount cap if specified
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      // For fixed amount discounts
      discountAmount = coupon.discountValue;
      
      // Don't allow discount to exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }
    }

    // Return the valid coupon with calculated discount
    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("[COUPON_VALIDATE]", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
} 