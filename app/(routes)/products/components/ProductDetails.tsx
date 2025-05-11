"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Edit, Minus, Plus, ShoppingCart } from "lucide-react";
import useCart from "@/store/useCart";
import { toast } from "sonner";
import Link from "next/link";
import { CustomAccordion } from "./CustomAccordion";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0] : undefined
  );
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

  const accordionItems = [
    {
      title: "Description",
      content: <p className="text-muted-foreground">{product.description}</p>,
    },
    {
      title: "Delivery Details",
      content: <div></div>,
    },
    {
      title: "Payment Methods",
      content: <div></div>,
    },
  ];

  return (
      <div className="lg:flex lg:gap-8">
        <div className="space-y-8 lg:w-1/2">
        <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex items-start">
            <span className="text-lg md:text-xl lg:text-2xl mt-1">₹</span>
            <span className="text-2xl md:text-3xl lg:text-4xl">{product.price}</span>
          </div>
          {product.salePrice && (
            <div className="flex items-start line-through font-extralight">
              <span className="text-sm md:text-base lg:text-lg mt-1">₹</span>
              <span className="text-xl md:text-2xl lg:text-3xl">{product.salePrice}</span>
            </div>
          )}
        </div>
            <a href="#" target="_blank" className="w-fit">
            <button 
              className="md:hidden text-md w-fit flex items-center px-4 py-2 border border-black rounded-full hover:bg-gray-50 transition-colors w-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Customise
            </button>
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            {product.sizes.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <span className="text-xl md:text-2xl ">Select Size <button className="text-sm md:text-lg ml-3 text-muted-foreground px-3 py-1 border border-gray-300 rounded-full">Size Chart</button> </span>
                <div className="flex flex-wrap gap-2 my-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md transition-all ${
                        selectedSize === size 
                          ? "border-black bg-black text-white" 
                          : "border-gray-300 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-xl md:text-2xl ">Select Color</h2>
                <div className="flex flex-wrap gap-3 my-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-md transition-all ${
                        selectedColor === color 
                          ? "ring-2 ring-offset-2 ring-black" 
                          : "ring-1 ring-gray-300 hover:ring-gray-400"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 min-w-[200px]">
              <h2 className="text-xl md:text-2xl ">Quantity</h2>
              <div className="flex items-center my-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-l-md border border-r-0 flex items-center justify-center disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-14 h-10 border-y flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.inventory}
                  className="w-10 h-10 rounded-r-md border border-l-0 flex items-center justify-center disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div>
            {isSelectedSizeInCart ? (
              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full py-6 text-lg bg-transparent hover:bg-black text-black hover:text-white border border-black transition-colors duration-300"
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This size is already in your cart. Select a different size to add another.
                </p>
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
        </div>

        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <CustomAccordion items={accordionItems} />
        </div>
      </div>
  );
};