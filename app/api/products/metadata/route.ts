import { NextRequest, NextResponse } from "next/server";
import { Category, ClothType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Return all categories and cloth types from the enums
    return NextResponse.json({
      categories: Object.values(Category),
      clothTypes: Object.values(ClothType)
    });
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch product metadata" },
      { status: 500 }
    );
  }
} 