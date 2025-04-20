"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

/**
 * Get current user helper
 */
async function currentUser() {
  const session = await getAuthSession();
  return session?.user;
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  try {
    const user = await currentUser();
    
    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalCompletedOrders,
      totalSales,
      totalCoupons
    ] = await Promise.all([
      db.product.count(),
      db.user.count(),
      db.order.count(),
      db.order.count({
        where: { status: OrderStatus.DELIVERED }
      }),
      db.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true }
      }),
      db.coupon.count()
    ]);

    return {
      products: totalProducts,
      users: totalUsers,
      orders: totalOrders,
      completedOrders: totalCompletedOrders,
      sales: totalSales._sum.total || 0,
      coupons: totalCoupons
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
}

/**
 * Get revenue data for chart
 */
export async function getRevenueData() {
  try {
    const user = await currentUser();
    
    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    // Get orders from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1); // Start from first day of month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: OrderStatus.DELIVERED
      },
      select: {
        total: true,
        createdAt: true
      }
    });

    // Group by month
    const monthlyData = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, orders: 0 };
      }
      
      acc[month].revenue += order.total;
      acc[month].orders += 1;
      
      return acc;
    }, {} as Record<string, { month: string; revenue: number; orders: number }>);

    // Sort by month chronologically
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Reorder months to show last 6 months in chronological order
    const relevantMonths = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12; // Ensure positive index
      return monthOrder[monthIndex];
    });

    // Create final data array with all months (even empty ones)
    const chartData = relevantMonths.map(month => {
      return monthlyData[month] || { month, revenue: 0, orders: 0 };
    });

    return chartData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw new Error("Failed to fetch revenue data");
  }
}

/**
 * Get product performance data
 */
export async function getTopProducts() {
  try {
    const user = await currentUser();
    
    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const products = await db.product.findMany({
      take: 5,
      orderBy: {
        timesSold: 'desc'
      },
      select: {
        id: true,
        name: true,
        timesSold: true,
        price: true
      }
    });

    return products;
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw new Error("Failed to fetch top products");
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders() {
  try {
    const user = await currentUser();
    
    if (!user || user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }

    const orders = await db.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return orders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
} 