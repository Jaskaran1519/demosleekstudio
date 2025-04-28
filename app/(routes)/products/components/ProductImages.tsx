"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Heart, Edit, ZoomIn } from "lucide-react";
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
  console.log(product.images)

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
                    className="hidden text-xl cursor-pointer md:flex items-center px-4 py-2 border border-black rounded-full hover:bg-gray-50 transition-colors"
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
        {/* Image slider with custom scrollbar */}
        <div className="image-slider flex overflow-x-auto gap-4 pb-4">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="relative w-64 md:w-80 lg:w-96 xl:w-104 xxl:w-200 flex-shrink-0 aspect-[4/5] rounded-lg overflow-hidden group"
            >
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="128px"
              />
              <button
                onClick={() => setSelectedImage(image)}
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                aria-label="View full size"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
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

<style jsx global>{`
    /* --- Enhanced Scrollbar Styling v2 --- */

    /* Target the scrollbar container */
    .image-slider {
      /* Firefox: Set scrollbar thickness */
      scrollbar-width: auto; /* Or 'thin', 'none'. 'auto' is usually default/thicker */

      /* Firefox: Set thumb and track color (Thumb, Track) */
      /* Note: Firefox scrollbar-color does NOT support borders */
      scrollbar-color: #D2B48C #FFFE; /* Darker Tan Thumb, Very Light Ivory Track */
    }

    /* --- WebKit (Chrome, Safari, Edge) Scrollbar Styling --- */

    /* 1. Overall scrollbar dimensions and base */
    .image-slider::-webkit-scrollbar {
      height: 12px; /* Maintain thickness */
      width: 12px;  /* Maintain thickness for potential vertical */
      background-color: #FFFE; /* Base background to match track */
    }

    /* 2. Style the track (the background area) */
    .image-slider::-webkit-scrollbar-track {
      background: #FFFE; /* Very light ivory/off-white track */
      border-radius: 10px;
      /* Subtle darker border for the track area */
      border: 1px solid #E0D8B0; /* Light beige border */
    }

    /* 3. Style the thumb (the draggable part) */
    .image-slider::-webkit-scrollbar-thumb {
      background-color: #D2B48C; /* Darker Tan background */
      border-radius: 10px;
      /* Even darker border for the thumb */
      border: 2px solid #B8860B; /* DarkGoldenrod border */
    }

    /* 4. Style the thumb on hover */
    .image-slider::-webkit-scrollbar-thumb:hover {
      background-color: #B8860B; /* Use border color for hover background */
      border-color: #8B4513;    /* Even darker border on hover (SaddleBrown) */
    }

    /* 5. Hide the default arrows (buttons) */
    .image-slider::-webkit-scrollbar-button {
       display: none; /* Hide scrollbar arrows */
    }
  `}</style>
    </div>
  );
};