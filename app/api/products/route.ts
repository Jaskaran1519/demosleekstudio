import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/cloudinary";
import { Category, ClothType } from "@prisma/client";

// Schema for products query
const productsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  clothType: z.union([z.string(), z.array(z.string())]).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "popularity"]).optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(12),
  skip: z.coerce.number().nonnegative().optional(),
});

// Product schema for POST/PATCH (creation and update)
const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  salePrice: z.number().optional(),
  inventory: z.number().int().nonnegative(),
  category: z.nativeEnum(Category),
  clothType: z.nativeEnum(ClothType),
  colors: z.union([z.string(), z.array(z.string())]).optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  sizes: z.array(z.string()).or(z.string()).optional(),
  noBgImage: z.string().url().optional(),
  modelImage: z.string().url().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  homePageFeatured: z.boolean().default(false),
});

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Debug: log all query parameters
    console.log("Query params:", queryParams);
    
    // Handle multiple cloth types (appears as clothType=SHIRT&clothType=COAT in the URL)
    const clothTypeParams = url.searchParams.getAll("clothType");
    if (clothTypeParams.length > 0) {
      queryParams.clothType = clothTypeParams.join(',');
    }
    
    // Handle multiple categories (appears as category=MEN&category=WOMEN in the URL)
    const categoryParams = url.searchParams.getAll("category");
    if (categoryParams.length > 0) {
      queryParams.category = categoryParams.join(',');
    }
    
    // Parse and validate query parameters
    const parsed = productsQuerySchema.safeParse(queryParams);
    
    if (!parsed.success) {
      console.error("Query parameter validation failed:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { search, category, clothType, sort, page, pageSize, skip } = parsed.data;
    
    // Debug: log parsed search term
    console.log("Search term:", search);
    
    // Build query filters
    const where: any = { isActive: true };
    
    if (category) {
      where.category = Array.isArray(category) 
        ? { in: category }
        : category;
    }
    
    if (clothType) {
      where.clothType = {
        in: Array.isArray(clothType) ? clothType : [clothType],
      };
    }
    
    if (search) {
      // Simplify the search to focus on the two most important fields
      where.OR = [
        // Search in name with case-insensitive contains
        { 
          name: { 
            contains: search,
            mode: "insensitive"
          } 
        },
        // Search in description with case-insensitive contains
        { 
          description: { 
            contains: search,
            mode: "insensitive"
          } 
        }
        // Note: We're removing the tags search which might be causing issues
      ];
      
      // Debug specific search behavior
      console.log("Using search query:", search);
      console.log("With search filter:", JSON.stringify(where.OR, null, 2));
    }
    
    // Debug: log final where clause
    console.log("Final where clause:", JSON.stringify(where, null, 2));
    
    // Determine sort order
    let orderBy: any = { createdAt: "desc" };
    
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "popularity") {
      orderBy = { timesSold: "desc" };
    }
    
    // For infinite scrolling, use skip if provided
    const skipAmount = skip !== undefined ? skip : (page - 1) * pageSize;
    
    // Fetch products with pagination
    const products = await db.product.findMany({
      where,
      orderBy,
      skip: skipAmount,
      take: pageSize,
    });
    
    // Debug: log products found
    console.log(`Found ${products.length} products out of ${await db.product.count({ where })}`);
    
    // Get total count for pagination
    const totalCount = await db.product.count({ where });
    
    return NextResponse.json({
      products,
      totalCount,
      hasMore: skipAmount + products.length < totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const data = parsed.data;
    
    // Handle images - ensure no undefined values
    const images = [
      data.noBgImage,
      data.modelImage,
      ...(data.images || [])
    ].filter((img): img is string => typeof img === 'string' && img.length > 0);
    
    // Handle tags - ensure no undefined values
    const tags = Array.isArray(data.tags) 
      ? data.tags.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
      : data.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) || [];
    
    // Handle sizes - ensure no undefined values
    const sizes = Array.isArray(data.sizes) 
      ? data.sizes.filter((size): size is string => typeof size === 'string' && size.length > 0)
      : data.sizes?.split(',').map((size: string) => size.trim()).filter(Boolean) || [];
    
    // Handle colors - ensure no undefined values
    const colors = typeof data.colors === 'string' 
      ? data.colors.split(',').map((color: string) => color.trim()).filter(Boolean)
      : Array.isArray(data.colors) 
        ? data.colors.filter((color): color is string => typeof color === 'string' && color.length > 0)
        : [];
    
    // Generate slug
    let slug = slugify(data.name);
    
    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a random number
    if (existingProduct) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Create the product
    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        inventory: data.inventory,
        noBgImage: data.noBgImage || "",
        modelImage: data.modelImage || "",
        images: images,
        category: data.category,
        clothType: data.clothType,
        colors: colors,
        tags: tags,
        sizes: sizes,
        isActive: data.isActive,
        homePageFeatured: data.homePageFeatured,
        slug: slug,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 