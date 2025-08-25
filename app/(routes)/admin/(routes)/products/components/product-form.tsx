"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { AlertModal } from "@/components/modals/alert-modal";
import { Category, ClothType } from "@prisma/client";

// Lazy load the heavy image manager component
const ProductImageManager = dynamic(() => 
  import('./product-image-manager').then(mod => mod.ProductImageManager), 
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
);

const categories = [
  "MEN",
  "KIDS",
  "WOMEN"
];

const productFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  salePrice: z.coerce.number().nonnegative({ message: "Sale price must be zero or positive" }).optional(),
  inventory: z.coerce.number().int().nonnegative({ message: "Inventory must be zero or positive" }),
  category: z.nativeEnum(Category),
  clothType: z.nativeEnum(ClothType),
  tags: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  isActive: z.boolean().default(true),
  homePageFeatured: z.boolean().default(false),
  noBgImage: z.string().optional(),
  modelImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  additionalImages: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: any;
}

export const ProductForm = ({ initialData }: ProductFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price || "0")),
          additionalImages: initialData.additionalImages || [],
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          inventory: 0,
          category: Category.MEN,
          clothType: ClothType.SHIRT,
          tags: "",
          sizes: "",
          colors: "",
          isActive: true,
          homePageFeatured: false,
          noBgImage: "",
          modelImage: "",
          additionalImages: [],
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const sizesArray = data.sizes ? data.sizes.split(',').map(size => size.trim()).filter(Boolean) : [];
      const colorsArray = data.colors ? data.colors.split(',').map(color => color.trim()).filter(Boolean) : [];

      const productData = {
        ...data,
        tags: tagsArray,
        sizes: sizesArray,
        colors: colorsArray,
        additionalImages: form.getValues("additionalImages"),
      };

      if (initialData) {
        await axios.patch(`/api/products/${initialData.id}`, productData);
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/products", productData);
        toast.success("Product created successfully");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    if (!initialData || !form.getValues("slug")) {
      const generatedSlug = slugify(name);
      form.setValue("slug", generatedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${initialData.id}`);
      router.push("/admin/products");
      router.refresh();
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title={initialData ? "Edit Product" : "Create Product"}
            description={initialData ? "Update product details" : "Add a new product to your store"}
          />
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Product name" 
                          {...field} 
                          onChange={handleNameChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="product-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Used for the product URL. Auto-generated from name, but can be customized.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description"
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="99.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="79.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <ProductImageManager form={form} />
            </div>
            <Separator />
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clothType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cloth Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a cloth type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ClothType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma separated tags" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas (e.g., "summer, casual, new")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Sizes</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma separated sizes" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Separate sizes with commas (e.g., "S, M, L, XL")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Colors</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma separated colors" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Separate colors with commas (e.g., "Red, Blue, Green")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-6">
              <Heading title="Settings" description="Manage product visibility and features" />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Is this product available for purchase?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="homePageFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Should this product be featured on the home page?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button disabled={loading} className="ml-auto" type="submit">
                {initialData ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};