import { getUserWishlist } from "@/actions/users";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { removeFromWishlist } from "@/actions/users";

export async function UserWishlist({ userId }: { userId: string }) {
  const wishlist = await getUserWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your wishlist is empty.</p>
        <Link href="/products" className="text-primary hover:underline mt-2 block">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative aspect-square">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
            <div className="p-4 space-y-2">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-medium hover:underline">{product.name}</h3>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  {product.salePrice ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                      <p className="font-medium text-primary">
                        {formatPrice(product.salePrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium">{formatPrice(product.price)}</p>
                  )}
                </div>
                <form action={async () => {
                  "use server";
                  await removeFromWishlist(product.id);
                }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500"
                  >
                    Remove
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 