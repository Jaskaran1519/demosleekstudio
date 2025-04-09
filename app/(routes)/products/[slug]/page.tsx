import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductImages } from "../components/ProductImages";
import { ProductDetails } from "../components/ProductDetails";
import { RecommendedProducts } from "../components/RecommendedProducts";
import { Container } from "@/components/ui/container";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await db.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <Container>
      <div className="space-y-8 lg:space-y-16 mt-3">
        <ProductImages product={product} />
        <ProductDetails product={product} />
        <div className="mt-16">
          <RecommendedProducts currentProduct={product} />
        </div>
      </div>
    </Container>
  );
} 