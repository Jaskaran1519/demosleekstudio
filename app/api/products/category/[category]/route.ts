import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Using any type to bypass type checking issues
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { category } = context.params;
    
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }
    
    // Build the where clause
    const where: any = {
      isActive: true,
      category: category.toUpperCase(),
    };

    // Fetch products with optional limit
    const products = await db.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit, // If limit is undefined, Prisma will return all products
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
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(`Error fetching category products:`, error);
    return NextResponse.json(
      { error: `Failed to fetch category products` },
      { status: 500 }
    );
  }
}
