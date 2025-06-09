import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Re-export the runtime configuration
export const runtime = 'nodejs';

type ShippingRate = {
  id: string;
  country: string;
  rate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  try {
    const rates = await prisma.shippingRate.findMany({
      where: { isActive: true },
      orderBy: { country: 'asc' },
    });
    
    return NextResponse.json(rates);
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { country, rate } = await request.json();

    // Validate input
    if (!country || typeof rate !== 'number' || rate < 0) {
      return NextResponse.json(
        { error: "Invalid input. Country and rate (positive number) are required." },
        { status: 400 }
      );
    }

    // Validate country is one of the allowed values
    const validCountries = [
      'INDIA', 'USA', 'CANADA', 'DUBAI', 'EUROPE', 'AUSTRALIA', 'NEW_ZEALAND'
    ];
    
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: `Invalid country. Must be one of: ${validCountries.join(', ')}` },
        { status: 400 }
      );
    }

    const rateData = await prisma.shippingRate.upsert({
      where: { country },
      update: { 
        rate,
        isActive: true,
        updatedAt: new Date() 
      },
      create: { 
        country, 
        rate,
        isActive: true 
      },
    });

    return NextResponse.json(rateData);
  } catch (error) {
    console.error("Error saving shipping rate:", error);
    return NextResponse.json(
      { error: "Failed to save shipping rate" },
      { status: 500 }
    );
  }
}
