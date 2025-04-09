"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { useViewTransitionRouter } from "@/hooks/use-view-transition";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useViewTransitionRouter();

  const handleClick = () => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-none cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
        <div className="relative aspect-[4/5]">
          {/* Default image (modelImage) */}
          <Image
            src={product.modelImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              viewTransitionName: `product-image-${product.id}`,
            }}
          />
          {/* Hover image (noBgImage) */}
          <Image
            src={product.noBgImage}
            alt={product.name}
            fill
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-xl line-clamp-1">{product.name}</h3>
            <Badge variant="secondary">{product.clothType}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Sleek Studio</p>
          <p className="text-sm font-light mt-2">₹ {product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 