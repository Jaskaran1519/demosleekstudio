import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

export const ProductPageSkeleton = () => {
  return (
    <Container>
      <div className="space-y-8 lg:space-y-16 mt-3">
        {/* ProductImages Component Skeleton */}
        <div>
          <Skeleton className="h-6 w-64 mb-4" /> {/* "Sleek Studio Category Collection" */}
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex flex-row justify-between items-center flex-grow">
                  <Skeleton className="h-10 w-3/4" /> {/* Product name */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-32 rounded-full hidden md:block" /> {/* Customize button */}
                    <Skeleton className="h-10 w-10 rounded-full" /> {/* Wishlist heart */}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 rounded-full" /> {/* Category pill */}
            </div>
          </div>
          
          {/* Image slider skeleton */}
          <div className="relative mt-5">
            <div className="image-slider flex overflow-x-auto gap-4 pb-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="relative w-64 md:w-80 lg:w-96 xl:w-104 flex-shrink-0 aspect-[4/5] rounded-lg overflow-hidden"
                >
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ProductDetails Component Skeleton */}
        <div className="lg:flex lg:gap-8">
          <div className="space-y-8 lg:w-1/2">
            {/* Price */}
            <div className="flex items-center justify-between gap-5">
              <Skeleton className="h-8 w-32" /> {/* Price */}
              <Skeleton className="h-10 w-32 rounded-full md:hidden" /> {/* Mobile customize button */}
            </div>
            
            {/* Size, Color, Quantity selectors */}
            <div className="flex flex-wrap gap-4">
              {/* Size selector */}
              <div className="flex-1 min-w-[200px]">
                <Skeleton className="h-8 w-48 mb-3" /> {/* "Select Size" */}
                <div className="flex flex-wrap gap-2 my-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-12 rounded-md" />
                  ))}
                </div>
              </div>
              
              {/* Color selector */}
              <div className="flex-1 min-w-[200px]">
                <Skeleton className="h-8 w-32 mb-3" /> {/* "Select Color" */}
                <div className="flex flex-wrap gap-3 my-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-8 h-8 rounded-md" />
                  ))}
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="flex-1 min-w-[200px]">
                <Skeleton className="h-8 w-24 mb-3" /> {/* "Quantity" */}
                <div className="flex items-center my-3">
                  <Skeleton className="w-10 h-10 rounded-l-md" />
                  <Skeleton className="w-14 h-10" />
                  <Skeleton className="w-10 h-10 rounded-r-md" />
                </div>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Skeleton className="w-full h-14 rounded-md" />
          </div>

          {/* Accordion section */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-2">
                <Skeleton className="h-12 w-full mb-2" /> {/* Accordion header */}
                {i === 1 && (
                  <div className="space-y-2 px-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RecommendedProducts Component Skeleton */}
        <div className="space-y-4 my-10">
          <Skeleton className="h-8 w-64 my-5" /> {/* "You May Also Like" */}
          <div className="relative">
            {/* Carousel skeleton */}
            <div className="flex overflow-x-auto gap-4 pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0">
                  <div className="rounded-lg overflow-hidden">
                    <Skeleton className="w-full aspect-[9/16] rounded-lg" /> {/* Product image with 9:16 ratio */}
                    <div className="mt-2 space-y-2">
                      <Skeleton className="h-5 w-3/4 mx-auto" /> {/* Product name - centered */}
                      <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Product price - centered */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Carousel controls */}
            <Skeleton className="absolute top-1/2 -left-4 transform -translate-y-1/2 h-10 w-10 rounded-full" />
            <Skeleton className="absolute top-1/2 -right-4 transform -translate-y-1/2 h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </Container>
  );
};