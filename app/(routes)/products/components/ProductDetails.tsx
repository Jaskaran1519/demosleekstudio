"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Edit, Minus, Plus, ShoppingCart } from "lucide-react";
import useCart from "@/store/useCart";
import { toast } from "sonner";
import Link from "next/link";
import useWishlist from "@/store/useWishlist";
import { Category as PrismaCategory, ClothType as PrimeClothType } from "@prisma/client";


interface ProductDetailsProps {
  product: any;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();


  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const { items, addItem } = useCart();

  // Check if this product with the currently selected size is already in the cart
  const isSelectedSizeInCart = items.some(
    (item) =>
      item.productId === product.id &&
      item.size === selectedSize
  );

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.inventory) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product.isActive || product.inventory < 1) {
      toast.error("This product is currently out of stock");
      return;
    }

    addItem({
      id: "", // Will be set by the store
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.noBgImage,
    });

    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
    window.location.href = "/checkout";
  }; ``

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeWishlistItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addWishlistItem({
        id: "",
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.noBgImage,
        category: product.category as PrismaCategory,
        clothType: product.clothType as PrimeClothType
      });
      toast.success("Added to wishlist");
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className=" mx-auto">
      {/* Main layout - flex-col on small, justify-between on large */}
      <div className="flex flex-col md:flex-row lg:justify-between gap-8 items-start mt-5 xl:mt-0">
        {/* Left side - Name + Options */}
        <div className="flex-1 space-y-4 md:space-y-3">
          {/* Product title */}
          <div>
            <h1 className="md:text-2xl xl:text-4xl hidden md:block font-bold text-gray-900 ">
              {product.name.toUpperCase()}
            </h1>
          </div>

          <div className="flex md:hidden mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              {product.salePrice && (
                <span className="text-lg xl:text-xl text-gray-400 line-through">
                  ₹{product.salePrice}
                </span>
              )}
            </div>
          </div>
          {/* Color and Size Selection Row */}
          <div className="flex gap-12">
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color: any) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color
                        ? "border-black"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Price and Actions */}
        <div className="flex-1 ">
          <div className="">
            {/* Price and Quantity Row */}
            <div className="flex justify-between items-center mb-6">
              {/* Price */}
              <div className="hidden md:flex gap-3">
                <div className="text-sm text-gray-500 mb-1">Price</div>
                <div className="flex items-baseline gap-2">
                  <span className=" md:text-2xl xl:text-3xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg xl:text-xl text-gray-400 line-through">
                      ₹{product.salePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div className="text-sm text-gray-500 mb-2 text-center">Quantity</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inventory}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <div className="flex-1">
                {isSelectedSizeInCart ? (
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full py-6 text-lg bg-transparent hover:bg-black text-black hover:text-white border border-black transition-colors duration-300"
                    >
                      <Link href="/cart">View Cart</Link>
                    </Button>

                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.isActive || product.inventory < 1}
                    className="w-full py-6 text-lg bg-transparent hover:bg-black text-black hover:text-white border border-black transition-colors duration-300"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                    {product.isActive && product.inventory > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </Button>
                )}
              </div>

              <Button
                onClick={toggleWishlist}
                className={`${!isWishlisted ? 'bg-black text-white' : 'bg-transparent hover:bg-black text-black hover:text-white border border-black'} hidden md:flex flex-1 w-full py-6 text-lg transition-colors duration-300`}
              >
                {isWishlisted ? 'Unsave' : 'Save'}
              </Button>
            </div>
            {isSelectedSizeInCart && (
              <p className="text-xs text-muted-foreground text-center py-3">
                This size is already in your cart. Select a different size to add another.
              </p>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};