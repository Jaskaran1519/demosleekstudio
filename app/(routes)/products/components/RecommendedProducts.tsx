import { Product } from "@/types";
import ProductCard from "@/components/Others/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getSimilarProducts } from "@/actions/products";

interface RecommendedProductsProps {
  currentProduct: Product;
}

export const RecommendedProducts = async ({ currentProduct }: RecommendedProductsProps) => {
  // Use server action instead of direct database access
  const recommendedProducts = await getSimilarProducts(currentProduct.id, 5);

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  return (
    <div className="space-y-4 my-10">
      <h2 className="text-2xl md:text-3xl my-5 font-semibold">You May Also Like</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendedProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};