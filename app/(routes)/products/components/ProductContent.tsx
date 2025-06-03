import { ProductImages } from "./ProductImages";
import { ProductDetails } from "./ProductDetails";
import { RecommendedProducts } from "./RecommendedProducts";
import { getProductBySlug } from "@/actions/products";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ProductContentProps {
  slug: string;
}

export async function ProductContent({ slug }: ProductContentProps) {
  // Use server action to fetch product data
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="">
      <Breadcrumb className="flex pb-4 ">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Collection</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:gap-4 xl:gap-8 ">
        <div className="w-full ">
          <ProductImages product={product} />
        </div>
        <div className="w-full">
          <ProductDetails product={product} />
          <div className="w-full  my-8 bg-gray-50 rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 py-4 px-5 md:p-10 flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl xl:text-3xl  font-semibold mb-1 lg:mb-2">
                  STYLISH {product.category}'S {product.clothType} <span className="ml-2">→</span>
                </h2>
                <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold mb-4 uppercase">
                  YOUR OUTWEAR UPGRADE
                </h3>
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center">
                <p className="text-base md:text-lg">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
            <RecommendedProducts currentProduct={product} />
    </div>
  );
}
