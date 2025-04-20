import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ 
        error: "Email parameter is required" 
      }, { status: 400 });
    }
    
    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: "User not found",
        email
      }, { status: 404 });
    }
    
    return NextResponse.json({
      user
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 