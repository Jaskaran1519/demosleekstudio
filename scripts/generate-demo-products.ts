"use server";

import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Category, ClothType } from "@prisma/client";

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
    description: "A stunning evening dress designed for special occasions. Features delicate embellishments and a flattering silhouette.",
    category: Category.WOMEN,
    clothType: ClothType.DRESS,
    price: 8500,
    salePrice: 7200,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Designer Lehnga",
    description: "A beautifully crafted lehnga with intricate embroidery and premium fabric. Perfect for weddings and special celebrations.",
    category: Category.WOMEN,
    clothType: ClothType.LEHNGA,
    price: 18000,
    salePrice: 15500,
    noBgImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962163/sleek-studio/products/gpkp10l9o8pfprq6dwiv.jpg",
    modelImage: "https://res.cloudinary.com/dqymrnulm/image/upload/v1746962164/sleek-studio/products/pyuquxqeknd6uxuye8vt.jpg",
  },
  {
    name: "Casual Kurti",
    description: "A comfortable and stylish kurti perfect for everyday wear. Features elegant embroidery and a relaxed fit.",
    category: Category.WOMEN,
    clothType: ClothType.KURTI,
    price: 2200,
    salePrice: null,
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
    name: "Silk Blouse",
    description: "An elegant silk blouse with a timeless design. Features premium fabric and attention to detail for a luxurious feel.",
    category: Category.WOMEN,
    clothType: ClothType.SHIRT,
    price: 4500,
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
  {
    name: "Cashmere Sweater",
    description: "A luxurious cashmere sweater designed for comfort and style. Features premium fabric and a relaxed fit.",
    category: Category.WOMEN,
    clothType: ClothType.SWEATER,
    price: 6500,
    salePrice: null,
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
    name: "Kids Party Dress",
    description: "A beautiful party dress for special occasions. Features delicate details and a comfortable design.",
    category: Category.KIDS,
    clothType: ClothType.DRESS,
    price: 3800,
    salePrice: null,
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
];

/**
 * Create demo products in the database
 */
export async function createDemoProducts() {
  try {
    console.log("Starting to create demo products...");
    
    let createdCount = 0;
    
    for (const template of productTemplates) {
      // Generate a slug based on the product name
      const slug = slugify(template.name);
      
      // Check if the slug already exists
      const existingProduct = await db.product.findUnique({
        where: { slug },
      });
      
      // If slug exists, append a random number to make it unique
      let uniqueSlug = slug;
      if (existingProduct) {
        uniqueSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Create product
      await db.product.create({
        data: {
          name: template.name,
          description: template.description,
          slug: uniqueSlug,
          price: template.price,
          salePrice: template.salePrice,
          inventory: 100,
          noBgImage: template.noBgImage,
          modelImage: template.modelImage,
          images: [template.noBgImage, template.modelImage],
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
      console.log(`Created product: ${template.name} (${createdCount}/${productTemplates.length})`);
    }
    
    console.log(`Successfully created ${createdCount} demo products!`);
    return { success: true, count: createdCount };
  } catch (error) {
    console.error("Error creating demo products:", error);
    throw new Error("Failed to create demo products");
  }
}
