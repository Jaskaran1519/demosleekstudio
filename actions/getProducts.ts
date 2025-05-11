"use server";

import { db } from "@/lib/db";

/**
 * Get active products for the carousel
 */
export async function getActiveProducts(limit = 8) {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        noBgImage: true,
        modelImage: true,
        category: true,
        clothType: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    return {
      products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
