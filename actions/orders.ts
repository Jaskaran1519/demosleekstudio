"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Get current user helper
 */
async function currentUser() {
  const session = await getAuthSession();
  return session?.user;
}

/**
 * Get user's orders
 */
export async function getUserOrders(limit?: number) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const orders = await db.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit ? { take: limit } : {}),
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

/**
 * Get order by ID (with authentication check)
 */
export async function getOrderById(orderId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Build the query based on user role
    const isAdmin = user.role === "ADMIN";
    const where = isAdmin
      ? { id: orderId } // Admin can view any order
      : { id: orderId, userId: user.id }; // Regular users can only view their own orders

    const order = await db.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        // Include user information for admin view
        ...(isAdmin && {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        }),
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

/**
 * Admin: Get all orders with pagination, search, and filtering
 */
export async function getAllOrders(
  page = 1,
  limit = 10,
  query?: string,
  status?: string
) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const skip = (page - 1) * limit;

    // Build the where clause based on search and filter criteria
    const where: any = {};

    // Add status filter if provided and valid
    if (status && status !== "all" && status !== "ALL") {
      where.status = status;
    }

    // Add search criteria if provided
    if (query) {
      where.OR = [
        // Search by customer name or email
        { user: { name: { contains: query, mode: "insensitive" } } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      db.order.count({ where }),
    ]);

    return {
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders`);

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
