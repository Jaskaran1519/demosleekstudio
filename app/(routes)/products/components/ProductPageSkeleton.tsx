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
        {/* Product Gallery Section */}
        <div className="w-full">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full space-y-6 mt-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-16 rounded-md" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-16 rounded-md" />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Skeleton className="w-full h-12 rounded-md" />
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