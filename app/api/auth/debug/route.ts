import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get session information
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "Not authenticated",
        session: null
      }, { status: 401 });
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      }
    });
    
    // Return session and user info (but hide sensitive data)
    return NextResponse.json({
      session: {
        ...session,
        expires: session.expires,
        user: {
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          id: session.user.id,
          image: session.user.image,
        }
      },
      databaseUser: user,
      matches: user?.id === session.user.id,
    });
  } catch (error) {
    console.error("Auth debug error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 