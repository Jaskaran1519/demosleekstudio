"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, PowerOff, Star, Trash } from "lucide-react";
import { toast } from "sonner";

interface ProductActionsProps {
  product: any;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onToggleStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle product status");
      }

      const result = await response.json();
      
      toast.success(`Product ${result.isActive ? "activated" : "deactivated"} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onToggleFeatured = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}/toggle-featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle product featured status");
      }

      const result = await response.json();
      
      toast.success(`Product ${result.homePageFeatured ? "added to" : "removed from"} featured section`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Optimistically remove the product from the UI
      const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
      if (productElement) {
        productElement.remove();
      }

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      
      // Refresh the product list
      router.refresh();
      
      // Only navigate if we're on the product detail page
      if (window.location.pathname !== "/admin/products") {
        router.push("/admin/products");
      }
    } catch (error) {
      // If there was an error, show an error toast and refresh to restore the product
      toast.error("Failed to delete product. Please try again.");
      console.error(error);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/products/${product.slug}`)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onToggleStatus}
            className="cursor-pointer"
            disabled={loading}
          >
            <PowerOff className="mr-2 h-4 w-4" />
            {product.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onToggleFeatured}
            className="cursor-pointer"
            disabled={loading}
          >
            <Star className="mr-2 h-4 w-4" />
            {product.homePageFeatured ? "Remove from featured" : "Add to featured"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-destructive focus:text-destructive cursor-pointer"
            disabled={loading}
          >
            <Trash className="mr-2 h-4 w-4" />
            {loading ? 'Deleting...' : 'Delete product'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}; 