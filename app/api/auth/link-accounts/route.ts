import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get the current authenticated user
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Parse the request body
    const body = await req.json();
    const { providerId, providerType, providerAccountId } = body;
    
    if (!providerId || !providerType || !providerAccountId) {
      return NextResponse.json({ 
        error: "Missing required parameters" 
      }, { status: 400 });
    }
    
    // Find the user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if the account already exists
    const existingAccount = await db.account.findFirst({
      where: {
        provider: providerId,
        providerAccountId: providerAccountId
      }
    });
    
    if (existingAccount) {
      return NextResponse.json({ 
        error: "Account already linked", 
        accountId: existingAccount.id
      }, { status: 400 });
    }
    
    // Create a new account link
    const account = await db.account.create({
      data: {
        userId: user.id,
        type: providerType,
        provider: providerId,
        providerAccountId: providerAccountId,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Account linked successfully",
      accountId: account.id
    });
  } catch (error) {
    console.error("Error linking accounts:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 