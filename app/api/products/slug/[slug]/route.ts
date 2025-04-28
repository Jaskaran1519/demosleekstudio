import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Using any type to bypass type checking issues
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { slug } = context.params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }
    
    const product = await db.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
