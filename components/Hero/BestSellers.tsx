import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getFeaturedProducts } from "@/actions/products"
import ProductCard from "@/components/Others/ProductCard"
import { Suspense } from "react"

export const BestSellers = async () => {
  const { products } = await getFeaturedProducts(8);

  return (
    <div className="w-[90%] mx-auto mt-6 md:mt-10">
      <h1 className="text-4xl my-3 ">Our BestSellers</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full "
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext />
        </Carousel>
      </Suspense>
    </div>
  )
}

export default BestSellers
