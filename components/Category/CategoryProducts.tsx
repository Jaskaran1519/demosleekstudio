'use client'

import React from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/Others/ProductCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type CategoryProductsProps = {
  products: Product[]
}

const CategoryProducts = ({  products }: CategoryProductsProps) => {
 

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="w-full py-12 px-4 md:px-8">
     
      
      <div className=" mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="mr-4" />
            <CarouselNext className="ml-4" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default CategoryProducts