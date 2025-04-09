import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: NextRequest) {
  try {
    // Verify that the request is from an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
    
    // Update all products to have an empty images array
    const updateResult = await db.product.updateMany({
      data: {
        images: []
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully cleared images array for ${updateResult.count} products.`
    });
    
  } catch (error) {
    console.error("Error emptying product images:", error);
    return NextResponse.json(
      { error: "Failed to empty product images" },
      { status: 500 }
    );
  }
} 