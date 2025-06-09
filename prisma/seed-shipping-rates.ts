import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const shippingRates = [
  { country: 'INDIA', rate: 10.99 },
  { country: 'USA', rate: 5.99 },
  { country: 'CANADA', rate: 7.99 },
  { country: 'DUBAI', rate: 12.99 },
  { country: 'EUROPE', rate: 8.99 },
  { country: 'AUSTRALIA', rate: 15.99 },
  { country: 'NEW_ZEALAND', rate: 18.99 },
] as const;

async function seedShippingRates() {
  try {
    console.log('Seeding shipping rates...');
    
    // Delete existing rates
    await prisma.shippingRate.deleteMany({});
    
    // Create new rates using upsert to avoid duplicates
    for (const rate of shippingRates) {
      await prisma.shippingRate.upsert({
        where: { country: rate.country },
        update: { rate: rate.rate },
        create: {
          country: rate.country,
          rate: rate.rate,
          isActive: true,
        },
      });
      console.log(`Upserted shipping rate for ${rate.country}: $${rate.rate}`);
    }
    
    console.log('✅ Shipping rates seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding shipping rates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedShippingRates()
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
