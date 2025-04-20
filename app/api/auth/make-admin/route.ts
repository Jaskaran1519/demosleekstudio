import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    // Get current session
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "Not authenticated" 
      }, { status: 401 });
    }
    
    // Make this user an admin
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "User promoted to admin",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error making admin:", error);
    return NextResponse.json({ 
      error: "Internal server error",
    }, { status: 500 });
  }
} 