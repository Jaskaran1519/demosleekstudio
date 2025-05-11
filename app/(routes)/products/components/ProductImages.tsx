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

interface ProductImagesProps {
  product: Product;
}

export const ProductImages = ({ product }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlist();

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

  return (
    <div>
      <h1 className="text-lg font-light mb-4">Sleek Studio {product.category}'s Collection</h1>
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex flex-row justify-between items-center flex-grow">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-bold pr-2 break-words">{product.name.toUpperCase()}</h1>
              <div className="flex items-center gap-2">
                <a href="#" target="_blank" className="w-fit">
                  <button 
                    className="hidden text-lg cursor-pointer md:flex items-center px-4 py-2 border border-black rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Customise
                  </button>
                </a>
                <button
                  onClick={toggleWishlist}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Bookmark
                    className={`h-8 w-8 ${
                      isWishlisted ? "fill-black text-black" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>    
          </div>
        </div>
      </div>
      
      <div className="relative mt-5">
        {/* shadcn Carousel implementation */}
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {product.images.map((image, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 sm:basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="relative aspect-[4/5] overflow-hidden group">
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                    aria-label="View full size"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
        </Carousel>
      </div>

      {/* Lightbox modal for full-size image view */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}
    </div>
  );
};