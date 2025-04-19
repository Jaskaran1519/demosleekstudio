import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.orderId;

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Get the shipping address
    const address = await db.address.findUnique({
      where: {
        id: order.shippingAddressId,
      }
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    // Transform the order data to match the expected format in the frontend
    const transformedOrder = {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discountAmount || 0,
      total: order.total,
      paymentStatus: order.paymentStatus,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        images: item.product.images
      })),
      address: {
        name: address.name,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      }
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 