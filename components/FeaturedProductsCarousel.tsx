"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import ProductCard from "./Others/ProductCard";
import { getFeaturedProducts } from "@/actions";
import { magerFont } from "@/app/fonts";

const FeaturedProductsCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [firstCarouselProducts, setFirstCarouselProducts] = useState<Product[]>([]);
  const [secondCarouselProducts, setSecondCarouselProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Use server action to fetch products
        const result = await getFeaturedProducts(12); // Fetch more products for two carousels
        
        if (result && result.products && result.products.length > 0) {
          const allProducts = result.products as Product[];
          setProducts(allProducts);
          
          // Split products between the two carousels
          const midpoint = Math.floor(allProducts.length / 2);
          
          // If odd number of products, put the extra one in the second carousel
          if (allProducts.length % 2 === 0) {
            setFirstCarouselProducts(allProducts.slice(0, midpoint));
            setSecondCarouselProducts(allProducts.slice(midpoint));
          } else {
            setFirstCarouselProducts(allProducts.slice(0, midpoint));
            setSecondCarouselProducts(allProducts.slice(midpoint));
          }
        } else {
          console.log("No products found");
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </Container>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Container className="min-h-[50vh]">
      <div className="flex items-center justify-center py-5 md:py-10 xl:py-10 w-full">
        <h1 className={`${magerFont.className} flex items-center gap-2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold`}>
          Our Latest Releases
          <img src="/extraimages/leaf.svg" alt="Leaf icon" className="w-8 h-8 md:w-10 md:h-10" />
        </h1>
      </div>
      {/* First Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0.5 md:-ml-1">
          {firstCarouselProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-0.5 md:pl-1 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

    </Container>
  );
};

export default FeaturedProductsCarousel;
