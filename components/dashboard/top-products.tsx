import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  timesSold: number;
  price: number;
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          Your best performing products by sales volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <Link 
                  href={`/admin/products/${product.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  Price: {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold">
                  {product.timesSold}
                </span>
                <span className="text-xs text-muted-foreground">units sold</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 