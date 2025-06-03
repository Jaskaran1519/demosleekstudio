import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Category, ClothType } from "@prisma/client";
import { NextResponse } from "next/server";

// Sample product data
const productTemplates = [
  // Men's products
  {
    name: "Classic Oxford Shirt",
    description: "A timeless oxford shirt crafted from premium cotton with a comfortable fit and versatile style. Perfect for both formal and casual occasions.",
    category: Category.MEN,
    clothType: ClothType.SHIRT,
    price: 3500,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Slim Fit Blazer",
    description: "A sophisticated slim fit blazer designed for the modern gentleman. Features a tailored silhouette and premium fabric for exceptional comfort and style.",
    category: Category.MEN,
    clothType: ClothType.BLAZER,
    price: 8500,
    salePrice: 7200,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Tailored Suit",
    description: "An impeccably tailored suit crafted from premium wool blend fabric. Features a modern cut with attention to every detail for a refined silhouette.",
    category: Category.MEN,
    clothType: ClothType.SUIT,
    price: 12000,
    salePrice: 10500,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Casual Linen Shirt",
    description: "A breathable linen shirt perfect for warm weather. Features a relaxed fit and natural fabric that gets better with each wear.",
    category: Category.MEN,
    clothType: ClothType.SHIRT,
    price: 2800,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Formal Tuxedo",
    description: "An elegant tuxedo for special occasions. Features satin lapels, a tailored fit, and premium fabric for a sophisticated look.",
    category: Category.MEN,
    clothType: ClothType.TUXEDO,
    price: 15000,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Wool Overcoat",
    description: "A premium wool overcoat designed for cold weather. Features a classic silhouette with modern details for timeless style.",
    category: Category.MEN,
    clothType: ClothType.COAT,
    price: 9500,
    salePrice: 8000,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Casual Chino Pants",
    description: "Versatile chino pants crafted from soft cotton twill. Features a comfortable fit and timeless design for everyday wear.",
    category: Category.MEN,
    clothType: ClothType.PANTS,
    price: 2500,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  
  // Women's products
  {
    name: "Elegant Evening Dress",
    description: "A stunning evening dress designed for special occasions. Features premium fabric and elegant details for a sophisticated look.",
    category: Category.WOMEN,
    clothType: ClothType.DRESS,
    price: 12000,
    salePrice: 10000,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Designer Lehnga",
    description: "A beautifully crafted lehnga with intricate embroidery and premium fabric. Perfect for weddings and special celebrations.",
    category: Category.WOMEN,
    clothType: ClothType.LEHNGA,
    price: 18000,
    salePrice: 15000,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Tailored Blazer",
    description: "A sophisticated blazer designed for the modern woman. Features a tailored fit and premium fabric for a polished look.",
    category: Category.WOMEN,
    clothType: ClothType.BLAZER,
    price: 7500,
    salePrice: 6500,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Casual Summer Dress",
    description: "A lightweight summer dress perfect for warm weather. Features breathable fabric and a comfortable fit for everyday wear.",
    category: Category.WOMEN,
    clothType: ClothType.DRESS,
    price: 3500,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Formal Pants",
    description: "Elegant formal pants designed for a professional look. Features a comfortable fit and premium fabric.",
    category: Category.WOMEN,
    clothType: ClothType.PANTS,
    price: 3200,
    salePrice: 2800,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  
  // Kids products
  {
    name: "Kids Formal Suit",
    description: "A charming formal suit designed for young gentlemen. Features premium fabric and a comfortable fit.",
    category: Category.KIDS,
    clothType: ClothType.SUIT,
    price: 4500,
    salePrice: 3800,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids Casual Shirt",
    description: "A comfortable casual shirt designed for everyday wear. Features soft fabric and a relaxed fit.",
    category: Category.KIDS,
    clothType: ClothType.SHIRT,
    price: 1800,
    salePrice: 1500,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids Winter Jacket",
    description: "A warm winter jacket designed for children. Features insulated fabric and a comfortable fit for cold weather.",
    category: Category.KIDS,
    clothType: ClothType.JACKET,
    price: 3200,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids Denim Pants",
    description: "Durable denim pants designed for active children. Features a comfortable fit and reinforced stitching.",
    category: Category.KIDS,
    clothType: ClothType.PANTS,
    price: 1500,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids Sweater",
    description: "A cozy sweater designed for children. Features soft fabric and a comfortable fit for everyday wear.",
    category: Category.KIDS,
    clothType: ClothType.SWEATER,
    price: 2200,
    salePrice: 1800,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids Party Dress",
    description: "A beautiful party dress designed for young girls. Features elegant details and premium fabric for special occasions.",
    category: Category.KIDS,
    clothType: ClothType.DRESS,
    price: 3500,
    salePrice: 3000,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Kids T-Shirt",
    description: "A comfortable t-shirt designed for everyday wear. Features soft cotton fabric and a relaxed fit.",
    category: Category.KIDS,
    clothType: ClothType.T_SHIRT,
    price: 1200,
    salePrice: null,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
];

/**
 * API route handler to delete all products and seed 20 new products with 5 images each
 */
export async function GET() {
  try {
    console.log("Starting to delete all existing products...");
    
    // Delete all existing products
    const deleteResult = await db.product.deleteMany({});
    console.log(`Deleted ${deleteResult.count} existing products.`);
    
    console.log("Starting to create demo products with 5 images each...");
    
    let createdCount = 0;
    // Limit to 20 products
    const templatesForSeeding = productTemplates.slice(0, 20);
    
    // Create additional image URLs based on the existing ones
    const imageUrls = [
      "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
      "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
      "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
      "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
      "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg"
    ];
    
    for (const template of templatesForSeeding) {
      // Generate a slug based on the product name
      const slug = slugify(template.name);
      
      // Create product with 5 images
      await db.product.create({
        data: {
          name: template.name,
          description: template.description,
          slug: slug,
          price: template.price,
          salePrice: template.salePrice,
          inventory: 100,
          noBgImage: template.noBgImage,
          modelImage: template.modelImage,
          // Add 5 images: noBgImage, modelImage, and 3 additional images
          images: imageUrls,
          category: template.category,
          clothType: template.clothType,
          colors: [],
          tags: [],
          sizes: ["S", "M", "L", "XL"],
          isActive: true,
          homePageFeatured: true,
        },
      });
      
      createdCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted all products and created ${createdCount} new products with 5 images each.`,
      count: createdCount
    });
  } catch (error: any) {
    console.error("Error in seed-products API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed products" },
      { status: 500 }
    );
  }
}