"use client";

import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// Define the structure of the form values this component will interact with
interface ProductImageFormValues {
  noBgImage?: string;
  modelImage?: string;
  additionalImages: string[];
}

interface ProductImageManagerProps {
  form: UseFormReturn<any>; // Use 'any' for broader compatibility with the main form's schema
}

export const ProductImageManager = ({ form }: ProductImageManagerProps) => {

  const handleNoBgImageUpload = useCallback(
    (result: { url: string }) => {
      form.setValue("noBgImage", result.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleModelImageUpload = useCallback(
    (result: { url: string }) => {
      form.setValue("modelImage", result.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleAdditionalImageUpload = useCallback(
    (result: { url: string }, index: number) => {
      const currentImages = form.getValues("additionalImages") || [];
      const newImages = [...currentImages];
      newImages[index] = result.url;
      
      form.setValue("additionalImages", newImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  const addImageSlot = useCallback(() => {
    const currentImages = form.getValues("additionalImages") || [];
    if (currentImages.length < 3) {
      form.setValue("additionalImages", [...currentImages, ""], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      toast.error("Maximum 5 images allowed (2 main + 3 additional)");
    }
  }, [form]);

  const removeAdditionalImage = useCallback((index: number) => {
    const currentImages = form.getValues("additionalImages") || [];
    const newImages = currentImages.filter((_: string, i: number) => i !== index);
    
    form.setValue("additionalImages", newImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [form]);

  const additionalImages = form.watch('additionalImages') || [];

  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="noBgImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Image (No Background)</FormLabel>
            <FormControl>
              <FileUpload
                endpoint="productNoBgImage"
                value={field.value || ''}
                onChange={handleNoBgImageUpload}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="modelImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Image</FormLabel>
            <FormControl>
              <FileUpload
                endpoint="productModelImage"
                value={field.value || ''}
                onChange={handleModelImageUpload}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <FormLabel>Additional Images (Max 3)</FormLabel>
        <div className="mt-2 space-y-4">
          {additionalImages.map((imageUrl: string, index: number) => (
            <div key={index} className="flex items-center gap-4">
              <FormField
                control={form.control}
                name={`additionalImages.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <FileUpload
                        endpoint="productAdditionalImages"
                        value={field.value || ''}
                        onChange={(result) => handleAdditionalImageUpload(result, index)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeAdditionalImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {additionalImages.length < 3 && (
          <Button type="button" variant="outline" size="sm" onClick={addImageSlot} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>
    </div>
  );
};
