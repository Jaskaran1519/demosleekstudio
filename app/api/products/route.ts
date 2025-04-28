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
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().positive().optional(),
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
    const queryParams: any = {};
    
    // Handle multiple cloth types (appears as clothType=SHIRT&clothType=COAT in the URL)
    const clothTypeParams = url.searchParams.getAll("clothType");
    if (clothTypeParams.length > 0) {
      queryParams.clothType = clothTypeParams;
    }
    
    // Handle multiple categories (appears as category=MEN&category=WOMEN in the URL)
    const categoryParams = url.searchParams.getAll("category");
    if (categoryParams.length > 0) {
      queryParams.category = categoryParams;
    }
    
    // Add other query parameters
    const searchParam = url.searchParams.get("search");
    if (searchParam) queryParams.search = searchParam;
    
    const sortParam = url.searchParams.get("sort");
    if (sortParam) queryParams.sort = sortParam;
    
    const pageParam = url.searchParams.get("page");
    if (pageParam) queryParams.page = parseInt(pageParam);
    
    const pageSizeParam = url.searchParams.get("pageSize");
    if (pageSizeParam) queryParams.pageSize = parseInt(pageSizeParam);
    
    const skipParam = url.searchParams.get("skip");
    if (skipParam) queryParams.skip = parseInt(skipParam);
    
    const featuredParam = url.searchParams.get("featured");
    if (featuredParam) queryParams.featured = featuredParam === "true";
    
    const limitParam = url.searchParams.get("limit");
    if (limitParam) queryParams.limit = parseInt(limitParam);
    
    // Parse and validate query parameters
    const parsed = productsQuerySchema.safeParse(queryParams);
    
    if (!parsed.success) {
      console.error("Query parameter validation failed:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { 
      search, 
      category, 
      clothType, 
      sort, 
      page, 
      pageSize, 
      skip,
      featured,
      limit
    } = parsed.data;
    
    // Build query filters
    const where: any = { isActive: true };
    
    if (category) {
      if (Array.isArray(category)) {
        where.category = {
          in: category
        };
      } else {
        where.category = category.toUpperCase();
      }
    }
    
    if (clothType) {
      where.clothType = {
        in: Array.isArray(clothType) ? clothType : [clothType]
      };
    }
    
    if (featured !== undefined) {
      where.homePageFeatured = featured;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    
    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }; // Default sort: newest first
    
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'popularity') {
      orderBy = { timesSold: 'desc' };
    }
    
    // Calculate pagination
    const take = limit || pageSize || 12;
    const skipAmount = skip !== undefined ? skip : (page - 1) * take;
    
    // Fetch products
    const products = await db.product.findMany({
      where,
      orderBy,
      skip: skipAmount,
      take,
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
    });
    
    // Get total count for pagination
    const totalCount = await db.product.count({ where });
    
    return NextResponse.json({
      products,
      totalCount,
      hasMore: skipAmount + products.length < totalCount,
      totalPages: Math.ceil(totalCount / Number(take)),
      currentPage: page,
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      console.warn("Unauthorized attempt to create product by:", session?.user?.email);
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("Received body:", body); // Log received data for debugging

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Product data validation failed:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    console.log("Validated data:", data); // Log validated data

    // Process noBgImage if it's a base64 string
    let noBgImageUrl = "";
    if (data.noBgImage) {
      if (data.noBgImage.startsWith('data:')) {
        const uploadResult = await uploadImage(data.noBgImage);
        noBgImageUrl = uploadResult.url;
      } else {
        noBgImageUrl = data.noBgImage;
      }
    }

    // Process modelImage if it's a base64 string
    let modelImageUrl = "";
    if (data.modelImage) {
      if (data.modelImage.startsWith('data:')) {
        const uploadResult = await uploadImage(data.modelImage);
        modelImageUrl = uploadResult.url;
      } else {
        modelImageUrl = data.modelImage;
      }
    }

    // Process additional images
    const additionalImages = [];
    if (data.images && Array.isArray(data.images)) {
      for (const image of data.images) {
        // Skip the main images that might be duplicated in the images array
        if (image === data.noBgImage || image === data.modelImage) {
          continue;
        }
        
        if (typeof image === 'string' && image.trim().length > 0) {
          if (image.startsWith('data:')) {
            const uploadResult = await uploadImage(image);
            additionalImages.push(uploadResult.url);
          } else {
            additionalImages.push(image);
          }
        }
      }
    }

    // Create the final images array with only Cloudinary URLs
    const images = [
      noBgImageUrl,
      modelImageUrl,
      ...additionalImages
    ].filter(img => typeof img === 'string' && img.trim().length > 0);
    
    console.log("Final images array for DB:", images); // Log the final images array

    // Handle tags - ensure array format and filter empty strings
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
      : typeof data.tags === 'string'
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];
    console.log("Final tags:", tags);

    // Handle sizes - ensure array format and filter empty strings
    const sizes = Array.isArray(data.sizes)
      ? data.sizes.filter((size): size is string => typeof size === 'string' && size.trim().length > 0)
      : typeof data.sizes === 'string'
        ? data.sizes.split(',').map((size: string) => size.trim()).filter(Boolean)
        : [];
    console.log("Final sizes:", sizes);

    // Handle colors - ensure array format and filter empty strings/invalid hex codes
    const colors = (
      Array.isArray(data.colors)
        ? data.colors
        : typeof data.colors === 'string'
          ? data.colors.split(',').map(c => c.trim())
          : []
    ).filter(color => typeof color === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(color)); // Basic hex validation
    console.log("Final colors:", colors);

    // Generate slug
    let slug = slugify(data.name);

    // Check if slug already exists and append random number if needed
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      const randomSuffix = Math.floor(Math.random() * 1000);
      slug = `${slug}-${randomSuffix}`;
      console.log(`Slug collision detected. Generated new slug: ${slug}`);
    }

    // Create the product in the database
    console.log("Creating product with data:", {
        name: data.name,
        slug: slug, // Use the potentially modified slug
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null, // Use null if undefined/zero
        inventory: data.inventory,
        // Store individual main images if your schema requires them
        noBgImage: noBgImageUrl,
        modelImage: modelImageUrl,
        // Use the correctly processed 'images' array
        images: images,
        category: data.category,
        clothType: data.clothType,
        colors: colors,
        tags: tags,
        sizes: sizes,
        isActive: data.isActive,
        homePageFeatured: data.homePageFeatured,
      });

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: slug, // Use the potentially modified slug
        description: data.description,
        price: data.price,
        salePrice: data.salePrice && data.salePrice > 0 ? data.salePrice : null, // Store null if 0 or undefined
        inventory: data.inventory,
        // Store individual main images if your schema/frontend needs them separately
        noBgImage: noBgImageUrl,
        modelImage: modelImageUrl,
        // Use the correctly processed 'images' array from the payload
        images: images,
        category: data.category,
        clothType: data.clothType,
        colors: colors,
        tags: tags,
        sizes: sizes,
        isActive: data.isActive,
        homePageFeatured: data.homePageFeatured,
        // Add any other fields your Product model requires
      },
    });

    console.log("Product created successfully:", product.id);
    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    // Provide more context in the error response if possible without leaking sensitive info
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to create product", details: errorMessage },
      { status: 500 }
    );
  }
}
