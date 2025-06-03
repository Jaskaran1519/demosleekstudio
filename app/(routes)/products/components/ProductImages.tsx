"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Heart, Edit, ZoomIn, Bookmark } from "lucide-react";
import useWishlist from "@/store/useWishlist";
import { toast } from "sonner";
import { Category as PrismaCategory, ClothType as PrimeClothType } from "@prisma/client";

// Import shadcn carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CustomAccordion } from "./CustomAccordion";
import { Button } from "@/components/ui/button";
interface ProductImagesProps {
  product: any;
}

export const ProductImages = ({ product }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addItem({
        id: "",
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.noBgImage,
        category: product.category as PrismaCategory,
        clothType: product.clothType as PrimeClothType
      });
      toast.success("Added to wishlist");
    }
    setIsWishlisted(!isWishlisted);
  };

  // Ensure we have images to display
  if (!product.images || product.images.length === 0) {
    return <div className="text-center p-8">No product images available</div>;
  }

  return (
    <div className="w-full">

      <div className="md:hidden flex justify-between items-center py-3">
        <h1 className="text-2xl font-bold text-gray-900 ">
          {product.name.toUpperCase()}
        </h1>
        <button
          onClick={toggleWishlist}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Bookmark
            className={`h-8 w-8 ${isWishlisted ? "fill-black text-black" : "text-gray-400"
              }`}
          />
        </button>
      </div>
      {/* Mobile Carousel - Below medium screens */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent className="-ml-0">
            {product.images.map((image: string, index: number) => (
              <CarouselItem key={index} className="pl-0">
                <div
                  className="relative aspect-[4/5] w-full cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover object-center "
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" /> */}
        </Carousel>
      </div>

      {/* Medium screens - 5:2 aspect ratio */}
      <div className="hidden md:block lg:hidden">
        <div className="w-full aspect-[5/2]">
          <div className="grid grid-cols-12 grid-rows-5 gap-2 h-full">
            {/* div1 - Main large image (spans 4 columns, 5 rows) */}
            <div
              className="col-start-1 col-end-5 row-start-1 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
              onClick={() => setSelectedImage(product.images[0])}
            >
              <Image
                src={product.images[0]}
                alt={`${product.name} main view`}
                fill
                className="object-cover object-center"
                sizes="33vw"
              />
            </div>

            {/* div2 - Second image (spans 2 columns, 2 rows) */}
            {product.images[1] && (
              <div
                className="col-start-5 col-end-7 row-start-1 row-end-3 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[1])}
              >
                <Image
                  src={product.images[1]}
                  alt={`${product.name} view 2`}
                  fill
                  className="object-cover object-center"
                  sizes="17vw"
                />
              </div>
            )}

            {/* div3 - Third image (spans 2 columns, 2 rows) */}
            {product.images[2] && (
              <div
                className="col-start-7 col-end-9 row-start-1 row-end-3 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[2])}
              >
                <Image
                  src={product.images[2]}
                  alt={`${product.name} view 3`}
                  fill
                  className="object-cover object-center"
                  sizes="17vw"
                />
              </div>
            )}

            {/* div4 - Fourth image (spans 4 columns, 3 rows) */}
            {product.images[3] && (
              <div
                className="col-start-5 col-end-9 row-start-3 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[3])}
              >
                <Image
                  src={product.images[3]}
                  alt={`${product.name} view 4`}
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </div>
            )}

            {/* div5 - Fifth image (spans 4 columns, 5 rows) */}
            {product.images[4] && (
              <div
                className="col-start-9 col-end-13 row-start-1 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[4])}
              >
                <Image
                  src={product.images[4]}
                  alt={`${product.name} view 5`}
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Large screens and above - 3:1 aspect ratio */}
      <div className="hidden lg:block">
        <div className="w-full aspect-[7/2]">
          <div className="grid grid-cols-12 grid-rows-5 gap-2 h-full">
            {/* div1 - Main large image (spans 4 columns, 5 rows) */}
            <div
              className="col-start-1 col-end-5 row-start-1 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
              onClick={() => setSelectedImage(product.images[0])}
            >
              <Image
                src={product.images[0]}
                alt={`${product.name} main view`}
                fill
                className="object-cover object-center"
                sizes="33vw"
              />
            </div>

            {/* div2 - Second image (spans 2 columns, 2 rows) */}
            {product.images[1] && (
              <div
                className="col-start-5 col-end-7 row-start-1 row-end-3 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[1])}
              >
                <Image
                  src={product.images[1]}
                  alt={`${product.name} view 2`}
                  fill
                  className="object-cover object-center"
                  sizes="17vw"
                />
              </div>
            )}

            {/* div3 - Third image (spans 2 columns, 2 rows) */}
            {product.images[2] && (
              <div
                className="col-start-7 col-end-9 row-start-1 row-end-3 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[2])}
              >
                <Image
                  src={product.images[2]}
                  alt={`${product.name} view 3`}
                  fill
                  className="object-cover object-center"
                  sizes="17vw"
                />
              </div>
            )}

            {/* div4 - Fourth image (spans 4 columns, 3 rows) */}
            {product.images[3] && (
              <div
                className="col-start-5 col-end-9 row-start-3 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[3])}
              >
                <Image
                  src={product.images[3]}
                  alt={`${product.name} view 4`}
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </div>
            )}

            {/* div5 - Fifth image (spans 4 columns, 5 rows) */}
            {product.images[4] && (
              <div
                className="col-start-9 col-end-13 row-start-1 row-end-6 cursor-pointer rounded-xl overflow-hidden relative"
                onClick={() => setSelectedImage(product.images[4])}
              >
                <Image
                  src={product.images[4]}
                  alt={`${product.name} view 5`}
                  fill
                  className="object-cover object-center"
                  sizes="33vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox modal with carousel for full-size image view */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          <Carousel className="w-full max-w-5xl">
            <CarouselContent>
              {product.images.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video h-full w-full">
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}
    </div>
  );
};