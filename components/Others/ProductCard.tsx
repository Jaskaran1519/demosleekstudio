"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types"; // Assuming Product type includes modelImage?: string;

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasModelImage = !!product.modelImage; // Check if a modelImage URL is provided

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="group relative overflow-hidden border-0 shadow-none cursor-pointer bg-transparent">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full">
            {/* Model Image (Bottom Layer - always opaque but covered initially if it exists) */}
            {hasModelImage && (
              <Image
                src={product.modelImage!} // Safe to use ! because of hasModelImage check
                alt={`${product.name} - model view`}
                fill
                className="object-cover" // No transition needed on this one
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false} // Lower loading priority than the initially visible image
              />
            )}

            {/* Primary image (noBgImage - Top Layer) */}
            <Image
              src={product.noBgImage}
              alt={product.name}
              fill
              className={`
                object-cover
                ${hasModelImage ? "transition-opacity duration-300 ease-in-out group-hover:opacity-0" : ""}
              `}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true} // This is the initially visible image
            />

            {!product.isActive && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"> {/* Ensure badge is on top */}
                <Badge variant="destructive" className="text-lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
          <div className="py-3">
            <h3 className="font-medium text-sm sm:text-md md:text-lg  line-clamp-1">{product.name.toUpperCase()}</h3>
            <p className="text-sm font-light mt-1">₹ {product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;