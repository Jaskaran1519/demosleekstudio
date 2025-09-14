import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

export const ProductPageSkeleton = () => {
  return (
    <Container>
      {/* Breadcrumb Skeleton */}
      <div className="flex pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <span>/</span>
          <Skeleton className="h-4 w-24" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="flex flex-col lg:gap-4 xl:gap-8">
        {/* Mobile-only header (name + wishlist icon placeholder) */}
        <div className="md:hidden flex justify-between items-center py-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Product Gallery Section */}
        <div className="w-full">
          {/* Mobile gallery matches ProductImages: single 4:5 carousel slide */}
          <div className="block md:hidden">
            <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>

          {/* Thumbnails only on md+ where grid is used visually */}
          <div className="hidden md:block">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full space-y-6 mt-6">
          <div>
            {/* Title visible on md+ like in ProductDetails */}
            <Skeleton className="h-8 w-3/4 mb-2 hidden md:block" />

            {/* Mobile price row (md:hidden) */}
            <div className="flex md:hidden mb-3">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>

            {/* Options: Color and Size */}
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-9 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Price (md+) aligned with quantity row */}
              <div className="hidden md:flex justify-between items-center mb-6">
                <div className="hidden md:flex gap-3">
                  <Skeleton className="h-4 w-12" />
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                {/* Quantity controls */}
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-6 rounded" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Quantity row for mobile (stacked) */}
              <div className="md:hidden">
                <Skeleton className="h-4 w-16 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-6 rounded" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>

              {/* Primary action button (Add to Cart / View Cart) */}
              <div className="pt-4 flex gap-3">
                <Skeleton className="w-full h-12 rounded-md" />
                {/* Wishlist button is hidden on mobile in real UI */}
                <Skeleton className="h-12 w-28 rounded-md hidden md:block" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="w-full my-8 bg-gray-50 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 md:p-10">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-10">
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};