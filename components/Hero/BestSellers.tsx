import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getFeaturedProducts } from "@/actions/products"
import ProductCard from "@/components/Others/ProductCard"
import { Suspense } from "react"
import { Product } from "@/types"

export const BestSellers = async () => {
  const { products } = await getFeaturedProducts(8);

  return (
    <div className="w-[90%] mx-auto mt-6 md:mt-10">
      <h1 className="text-4xl my-3">Our BestSellers</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product: Product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </Suspense>
    </div>
  )
}

export default BestSellers
