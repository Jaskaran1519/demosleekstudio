import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function emptyProductImages() {
  try {
    console.log('Starting to clear product images arrays...');
    
    // Update all products to have an empty images array
    // Note: We're preserving noBgImage and modelImage, only clearing the images array
    const updateResult = await prisma.product.updateMany({
      data: {
        images: []
      }
    });
    
    console.log(`Successfully cleared images array for ${updateResult.count} products.`);
    
    // Optional: List all products to verify the change
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        images: true,
        noBgImage: true,
        modelImage: true
      }
    });
    
    console.log('Current product image status:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.id}):`);
      console.log(`  • noBgImage: ${product.noBgImage ? 'Present' : 'Missing'}`);
      console.log(`  • modelImage: ${product.modelImage ? 'Present' : 'Missing'}`);
      console.log(`  • images array: ${product.images.length === 0 ? 'Empty' : `Contains ${product.images.length} images`}`);
    });
    
    console.log('Operation completed successfully.');
  } catch (error) {
    console.error('Error while emptying product images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
emptyProductImages()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 