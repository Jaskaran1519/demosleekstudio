"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Heart, Edit } from "lucide-react";
import useWishlist from "@/store/useWishlist";
import { toast } from "sonner";
import { Category as PrismaCategory, ClothType as PrimeClothType } from "@prisma/client";

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
  
  // Get unique images without duplicates
  const allImages = Array.from(new Set([product.modelImage, product.noBgImage, ...product.images]));

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-semibold pr-2 break-words">{product.name}</h1>
              <div className="flex items-center gap-2">
                <a href="#" target="_blank" className="w-fit">
                  <button 
                    className="hidden  text-xl cursor-pointer md:flex items-center px-4 py-2 border border-black rounded-full hover:bg-gray-50 transition-colors"
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
                  <Heart
                    className={`h-8 w-8 ${
                      isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>    
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm md:text-md lg:text-lg text-gray-500 bg-gray-100 px-4 py-1 rounded-full w-fit">{product.category}</p>
          </div>
         
        </div>
      </div>
      <div className="relative mt-5">
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative w-64 md:w-80 lg:w-96 xl:w-104 flex-shrink-0 aspect-[4/5] rounded-lg overflow-hidden"
            >
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="128px"
              />
            </button>
          ))}
        </div>
      </div>

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