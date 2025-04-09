"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  isActive: boolean;
}

export const AddToCartButton = ({ isActive }: AddToCartButtonProps) => {
  return (
    <Button 
      className="w-full" 
      disabled={!isActive}
      onClick={() => {
        // TODO: Add to cart functionality
      }}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isActive ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
};

export default AddToCartButton; 