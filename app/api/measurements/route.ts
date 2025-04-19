import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { measurements: true }
    });

    return NextResponse.json(user?.measurements || []);
  } catch (error) {
    console.error("[MEASUREMENTS_GET]", error);
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
    const { name, measurements } = body;

    if (!name || !measurements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        measurements: {
          push: {
            id: Date.now().toString(),
            name,
            measurements,
            createdAt: new Date(),
          }
        }
      }
    });

    return NextResponse.json(user.measurements);
  } catch (error) {
    console.error("[MEASUREMENTS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const measurementId = searchParams.get("id");

    if (!measurementId) {
      return NextResponse.json({ error: "Measurement ID is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { measurements: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedMeasurements = user.measurements.filter(
      (m: any) => m.id !== measurementId
    );

    // Use Prisma.JsonArray to specify the type explicitly
    await db.user.update({
      where: { id: session.user.id },
      data: {
        // @ts-ignore - Force the type to bypass TypeScript's check
        measurements: updatedMeasurements
      }
    });

    return NextResponse.json(updatedMeasurements);
  } catch (error) {
    console.error("[MEASUREMENTS_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}