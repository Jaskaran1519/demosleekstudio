"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";
import { Product } from "@/types";

// Types
type ProductsParams = {
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  skip?: number;
};

// Admin types
type AdminProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "active" | "inactive" | "all";
};

/**
 * Create a new product
 */
export async function createProduct(data: any) {
  try {
    // Generate a slug based on the product name
    const slug = slugify(data.name);

    // Check if the slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });

    // If slug exists, append a random number to make it unique
    let uniqueSlug = slug;
    if (existingProduct) {
      uniqueSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Create new product
    const product = await db.product.create({
      data: {
        ...data,
        slug: uniqueSlug,
        // Convert string arrays appropriately
        tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map((tag: string) => tag.trim()) || [],
        sizes: Array.isArray(data.sizes) ? data.sizes : data.sizes?.split(',').map((size: string) => size.trim()) || [],
        images: Array.isArray(data.images) ? data.images : [data.noBgImage, data.modelImage],
      },
    });

    revalidatePath("/admin/products");
    // Invalidate cached product queries
    revalidateTag("products");
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: any) {
  try {
    // Check if the name has changed, if so, update the slug
    let updateData = { ...data };
    
    const existingProduct = await db.product.findUnique({
      where: { id },
      select: { name: true },
    });

    if (existingProduct && existingProduct.name !== data.name) {
      const newSlug = slugify(data.name);
      
      // Check if the new slug already exists (except for this product)
      const slugExists = await db.product.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      // If slug exists, append a random number to make it unique
      updateData.slug = slugExists 
        ? `${newSlug}-${Math.floor(Math.random() * 1000)}`
        : newSlug;
    }

    // Handle arrays correctly
    if (data.tags) {
      updateData.tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map((tag: string) => tag.trim());
    }
    
    if (data.sizes) {
      updateData.sizes = Array.isArray(data.sizes) ? data.sizes : data.sizes.split(',').map((size: string) => size.trim());
    }
    
    if (data.images) {
      updateData.images = Array.isArray(data.images) ? data.images : [data.noBgImage, data.modelImage];
    }

    // Update product
    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/admin/products`);
    // Invalidate cached product queries
    revalidateTag("products");
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

/**
 * Toggle product status (active/inactive)
 */
export async function toggleProductStatus(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Toggle the status
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    });

    revalidatePath(`/admin/products`);
    revalidateTag("products");
    return updatedProduct;
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw new Error("Failed to update product status");
  }
}

/**
 * Toggle product featured status
 */
export async function toggleProductFeatured(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { homePageFeatured: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Toggle the featured status
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        homePageFeatured: !product.homePageFeatured,
      },
    });

    revalidatePath(`/admin/products`);
    revalidateTag("products");
    return updatedProduct;
  } catch (error) {
    console.error("Error toggling product featured status:", error);
    throw new Error("Failed to update product featured status");
  }
}

/**
 * Get a product by slug (server-side cached)
 * Uses unstable_cache with tag "products" so mutations can invalidate.
 */
export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const product = await db.product.findUnique({
        where: {
          slug,
          isActive: true,
        },
      });
      return product;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      throw new Error("Failed to fetch product");
    }
  },
  ["getProductBySlug"],
  { tags: ["products"] }
);

/**
 * Get similar products based on category and tags (lightly cached)
 */
export const getSimilarProducts = unstable_cache(
  async (productId: string, limit = 4) => {
    try {
      // First, get the current product to access its category and tags
      const currentProduct = await db.product.findUnique({
        where: { id: productId },
        select: {
          category: true,
          tags: true,
        },
      });

      if (!currentProduct) {
        throw new Error("Product not found");
      }

      // Find products with the same category or tags
      const similarProducts = await db.product.findMany({
        where: {
          id: { not: productId }, // Exclude the current product
          isActive: true,
          OR: [
            { category: currentProduct.category },
            { tags: { hasSome: currentProduct.tags } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          price: true,
          salePrice: true,
          inventory: true,
          noBgImage: true,
          modelImage: true,
          images: true,
          category: true,
          clothType: true,
          tags: true,
          sizes: true,
          isActive: true,
          homePageFeatured: true,
          createdAt: true,
          updatedAt: true,
          wishedByIds: true,
        },
        orderBy: { timesSold: "desc" }, // Sort by popularity
        take: limit,
      });

      return similarProducts;
    } catch (error) {
      console.error("Error fetching similar products:", error);
      throw new Error("Failed to fetch similar products");
    }
  },
  ["getSimilarProducts"],
  { tags: ["products"] }
);

/**
 * Get a product by ID (for admin)
 */
export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        orderItems: {
          include: {
            order: true,
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product");
  }
}

/**
 * Get products for admin with filtering and pagination
 */
export async function getAdminProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  status = "all",
}: AdminProductsParams = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {};

    if (status !== "all") {
      where.isActive = status === "active";
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch products with pagination
    const products = await db.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalCount = await db.product.count({ where });

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        homePageFeatured: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    return {
      products,
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}

/**
 * Get products by category with limit
 */
export async function getProductsByCategory(category: "MEN" | "WOMEN" | "KIDS", limit = 5) {
  try {
    // Validate category
    if (!category) {
      throw new Error("Category is required");
    }
    
    // Fetch products by category (no need to normalize since we're using typed categories)
    const products = await db.product.findMany({
      where: {
        isActive: true,
        category,
      },
      orderBy: [
        { homePageFeatured: 'desc' }, // Featured products first
        { updatedAt: 'desc' },         // Then newest products
      ],
      take: limit,
      // Include all fields required by the Product type
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        price: true,
        salePrice: true,
        inventory: true,
        noBgImage: true,
        modelImage: true,
        images: true,
        category: true,
        clothType: true,
        tags: true,
        sizes: true,
        isActive: true,
        homePageFeatured: true,
        createdAt: true,
        updatedAt: true,
        wishedByIds: true, // Add this field to fix the TypeScript error
        colors: true,      // Include optional fields
        timesSold: true,   // Include optional fields
        customisations: true, // Include optional fields
      },
    });

    // Use type assertion to ensure compatibility with the Product interface
    return { products: products as unknown as Product[] };
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    // Return empty array instead of throwing to prevent page crashes
    return { products: [] as Product[] };
  }
}