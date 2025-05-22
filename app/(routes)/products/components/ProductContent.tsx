import { ProductImages } from "./ProductImages";
import { ProductDetails } from "./ProductDetails";
import { RecommendedProducts } from "./RecommendedProducts";
import { getProductBySlug } from "@/actions/products";
import { notFound } from "next/navigation";

interface ProductContentProps {
  slug: string;
}

export async function ProductContent({ slug }: ProductContentProps) {
  // Use server action to fetch product data
  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 lg:space-y-16">
      <ProductImages product={product} />
      <ProductDetails product={product} />
      <div className="mt-16">
        <RecommendedProducts currentProduct={product} />
      </div>
    </div>
  );
}
