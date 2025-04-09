'use client'

import * as React from "react"
import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useViewTransitionRouter } from "@/hooks/use-view-transition"
import { Product } from "@/types"

// Using a custom product type since we can't be sure all fields from Prisma will be present
type ProductData = {
  id: string
  name: string
  description: string
  slug: string
  price: number
  salePrice: number | null
  inventory: number
  noBgImage: string
  modelImage: string
  category: string
  clothType: string
  images: string[]
  isActive?: boolean
  homePageFeatured?: boolean
  tags?: string[]
  sizes?: string[]
  wishedByIds?: string[]
}

// Helper function to convert our ProductData to the expected Product type
const toProductType = (data: ProductData): Product => {
  // Ensure required fields have defaults if potentially missing
  const defaults = {
    isActive: true,
    homePageFeatured: false,
    tags: [],
    sizes: [],
    wishedByIds: [],
    colors: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    timesSold: 0,
  };

  return {
    ...defaults, // Apply defaults first
    ...data, // Override with actual data
    category: data.category as any, // Cast to PrismaCategory
    clothType: data.clothType as any, // Cast to PrimeClothType
    // Ensure potentially undefined fields from data are overridden by defaults if needed
    isActive: data.isActive ?? defaults.isActive,
    homePageFeatured: data.homePageFeatured ?? defaults.homePageFeatured,
    tags: data.tags ?? defaults.tags,
    sizes: data.sizes ?? defaults.sizes,
    wishedByIds: data.wishedByIds ?? defaults.wishedByIds,
  };
};


const CustomProductCard = ({ product }: { product: Product }) => {
  const router = useViewTransitionRouter();

  const handleClick = () => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-none cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          {/* Only show the noBgImage */}
          <Image
            src={product.noBgImage}
            alt={product.name}
            fill
            className="object-contain object-top p-4"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 40vw"
            style={{
              viewTransitionName: `product-image-${product.id}`,
            }}
          />
          {!product.isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-xl line-clamp-1">{product.name}</h3>
            <Badge variant="secondary">{product.clothType.replace('_', ' ')}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Sleek Studio</p>
          {product.salePrice ? (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm line-through text-muted-foreground">₹ {product.price.toFixed(2)}</p>
              <p className="text-sm font-medium text-red-600">₹ {product.salePrice.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-sm font-light mt-2">₹ {product.price.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
type CarouselProps = {
  products: ProductData[]
  activeIndex: number
  setActiveIndex: (index: number) => void
}

const ProductCarousel = ({ products, activeIndex, setActiveIndex }: CarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) return

    // Listen for carousel changes and update activeIndex
    const onChange = () => {
      if (api) {
        setActiveIndex(api.selectedScrollSnap())
      }
    }

    api.on("select", onChange)

    // Cleanup
    return () => {
      api.off("select", onChange)
    }
  }, [api, setActiveIndex])

  return (
    <div className="w-full lg:w-4/5 mx-auto">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className="">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="basis-full">
              <div className="py-8 flex justify-center items-center h-full">
                {/* Custom ProductCard with responsive scaling */}
                {/* Adjusted scaling slightly for better fit */}
                <div className="transform scale-100 md:scale-105 lg:scale-100 w-4/5 sm:w-3/5 mx-auto">
                  <CustomProductCard product={toProductType(product)} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-8">
          <CarouselPrevious className="mr-4" />
          <CarouselNext className="ml-4" />
        </div>
      </Carousel>

      {/* Pagination indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-black' : 'bg-gray-300'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const ImageArea = ({ product }: { product: ProductData | null }) => {
  if (!product) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      <Image
        src={product.modelImage}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 40vw" // Adjusted sizes attribute
        priority
        className="object-cover object-top"
      />
    </div>
  )
}

// Client-side component to handle state
const FeaturedProductsClient = ({ products }: { products: ProductData[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure products array is not empty before accessing index 0
  if (!products || products.length === 0) {
    return <div>No featured products available.</div>; // Or some other placeholder/message
  }

  // Get the active product *after* the check
  const activeProduct = products[activeIndex];

  return (
    // Add max-width constraint for larger screens (e.g., xl)
    <div className="flex flex-col gap-10 mx-auto max-w-full"> {/* <-- Added max-w-full xl:max-w-7xl */}
      {/* Main container - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image area - Adjusted width to 40% (w-2/5) on md screens and up */}
        <div className="w-full md:w-2/5 aspect-square">
          <ImageArea product={activeProduct} />
        </div>
        {/* Carousel - Adjusted width to 60% (w-3/5) on md screens and up */}
        <div className="w-full md:w-3/5 flex items-center">
          <ProductCarousel
            products={products}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturedProductsClient;