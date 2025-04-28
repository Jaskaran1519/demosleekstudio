import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ProductContent } from "../components/ProductContent";
import { ProductPageSkeleton } from "../components/ProductPageSkeleton";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <Container>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductContent slug={slug} />
      </Suspense>
    </Container>
  );
}