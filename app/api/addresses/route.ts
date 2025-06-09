import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { id: 'desc' }
      ]
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESSES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    if (!name || !addressLine1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If this address is set as default, remove default from other addresses
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        name,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESSES_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    if (!id || !name || !addressLine1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If this address is set as default, remove default from other addresses
    if (isDefault) {
      await db.address.updateMany({
        where: {
          userId: session.user.id,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: {
        name,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("[ADDRESSES_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  console.log("[ADDRESSES_DELETE] Starting delete operation");
  
  try {
    // Get session first
    const session = await getAuthSession();
    if (!session?.user) {
      console.log("[ADDRESSES_DELETE] Unauthorized: No session or user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[ADDRESSES_DELETE] User ID:", session.user.id);

    // Get ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log(`[ADDRESSES_DELETE] Attempting to delete address with ID: ${id}`);

    if (!id) {
      console.log("[ADDRESSES_DELETE] Missing address ID");
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Start a transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Verify the address exists and belongs to the user
      const existingAddress = await tx.address.findUnique({
        where: { id },
        select: { 
          id: true,
          userId: true,
          isDefault: true 
        }
      });

      if (!existingAddress) {
        console.log(`[ADDRESSES_DELETE] Address not found: ${id}`);
        throw new Error('Address not found');
      }

      if (existingAddress.userId !== session.user.id) {
        console.log(`[ADDRESSES_DELETE] Address doesn't belong to user. Address user: ${existingAddress.userId}, Current user: ${session.user.id}`);
        throw new Error('Unauthorized to delete this address');
      }

      // Delete the address
      await tx.address.delete({
        where: { id }
      });
      console.log(`[ADDRESSES_DELETE] Successfully deleted address: ${id}`);

      // If the deleted address was the default, set another address as default
      if (existingAddress.isDefault) {
        console.log(`[ADDRESSES_DELETE] Deleted address was default, finding new default`);
        const anotherAddress = await tx.address.findFirst({
          where: { 
            userId: session.user.id,
            id: { not: id } // Make sure we don't select the same address
          },
          orderBy: { id: "desc" },
          select: { id: true }
        });

        if (anotherAddress) {
          console.log(`[ADDRESSES_DELETE] Setting new default address: ${anotherAddress.id}`);
          await tx.address.update({
            where: { id: anotherAddress.id },
            data: { isDefault: true }
          });
        } else {
          console.log('[ADDRESSES_DELETE] No other addresses found to set as default');
        }
      }

      return { success: true };
    });

    return NextResponse.json(result);
    
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; meta?: any };
    console.error("[ADDRESSES_DELETE] Error:", {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
    });

    // Handle known Prisma errors
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    
    if (err.code === 'P2003') {
      return NextResponse.json({ 
        error: "Cannot delete address as it's being used in existing orders" 
      }, { status: 400 });
    }

    // Handle custom errors
    if (err.message === 'Address not found') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    
    if (err.message === 'Unauthorized to delete this address') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Default error response
    return NextResponse.json({ 
      error: "Failed to delete address",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message || 'Unknown error',
        code: err.code
      })
    }, { status: 500 });
  }
}