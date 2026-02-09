import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Fetch distinct categories and clothTypes from products that exist in the database
    const [categoriesResult, clothTypesResult] = await Promise.all([
      db.product.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ["category"],
      }),
      db.product.findMany({
        where: { isActive: true },
        select: { clothType: true },
        distinct: ["clothType"],
      }),
    ]);

    // Extract just the values from the results
    const categories = categoriesResult.map((p) => p.category);
    const clothTypes = clothTypesResult.map((p) => p.clothType);

    return NextResponse.json({
      categories,
      clothTypes,
    });
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch product metadata" },
      { status: 500 }
    );
  }
} 