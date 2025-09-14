"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types"; // Assuming Product type includes modelImage?: string;
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasModelImage = !!product.modelImage; // Check if a modelImage URL is provided
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();

  // Track prefetch to avoid duplicate requests per session render
  const prefetchedKey = `prefetched:${product.slug}`;

  const prefetchDetails = async () => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(prefetchedKey)) return;
    try {
      // Warm server cache for product details
      fetch(`/api/products/prefetch/${product.slug}`, {
        method: "GET",
        // Best-effort; don't block the UI
        cache: "no-store",
        keepalive: true as any,
      }).catch(() => {});
      // Also ask Next to prefetch the route RSC payload/assets
      router.prefetch(`/products/${product.slug}`);
      sessionStorage.setItem(prefetchedKey, "1");
    } catch {}
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          prefetchDetails();
          observer && observer.disconnect();
        }
      });
      observer.observe(node);
    } else {
      // Fallback: prefetch on mount on older browsers
      prefetchDetails();
    }

    return () => {
      observer && observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block"
      prefetch
      ref={rootRef}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
    >
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
              priority={false} // Avoid eager loads for all grid items to save bandwidth
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