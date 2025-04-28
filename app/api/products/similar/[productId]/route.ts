import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Using any type to bypass type checking issues
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { productId } = context.params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "4");
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // First, get the current product to access its category and tags
    const currentProduct = await db.product.findUnique({
      where: { id: productId },
      select: {
        category: true,
        tags: true,
      },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Find products with the same category or tags
    const similarProducts = await db.product.findMany({
      where: {
        id: { not: productId }, // Exclude the current product
        isActive: true,
        OR: [
          { category: currentProduct.category },
          { tags: { hasSome: currentProduct.tags } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        price: true,
        salePrice: true,
        inventory: true,
        noBgImage: true,
        modelImage: true,
        images: true,
        category: true,
        clothType: true,
        tags: true,
        sizes: true,
        isActive: true,
        homePageFeatured: true,
        createdAt: true,
        updatedAt: true,
        wishedByIds: true,
      },
      orderBy: { timesSold: "desc" }, // Sort by popularity
      take: limit,
    });

    return NextResponse.json({ products: similarProducts });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar products" },
      { status: 500 }
    );
  }
}
