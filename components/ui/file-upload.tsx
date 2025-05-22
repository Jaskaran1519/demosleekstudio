"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";

interface FileUploadProps {
  endpoint: string;
  value?: string;
  onChange: (url: { url: string; isBase64?: boolean }) => void;
  directUpload?: boolean;
}

// Maximum file size: 3MB
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

export const FileUpload = ({
  endpoint,
  value = "",
  onChange,
  directUpload = false,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 3MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      toast.error(`File size exceeds 3MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      e.target.value = ''; // Clear the input
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        if (directUpload) {
          try {
            // Upload directly to Cloudinary via our API
            const response = await axios.post('/api/upload', {
              image: base64Image,
              folder: 'sleek-studio/products'
            });
            
            // Return the Cloudinary URL
            onChange({ url: response.data.url });
          } catch (error: any) {
            console.error("Error uploading to Cloudinary:", error);
            setError(error.response?.data?.error || "Failed to upload image");
            toast.error(error.response?.data?.error || "Failed to upload image");
          }
        } else {
          // Just pass the base64 data for form handling
          // Mark it as base64 so we know to upload it later
          onChange({ url: base64Image, isBase64: true });
        }
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while uploading the file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {value ? (
        <div className="relative w-full h-40 mb-4">
          <Image
            fill
            src={value}
            alt="Upload"
            className="object-contain"
          />
          <Button
            onClick={() => onChange({ url: "" })}
            variant="destructive"
            size="sm"
            className="absolute top-0 right-0"
          >
            Remove
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or WebP (Max: 3MB)
                </p>
                {error && (
                  <div className="flex items-center mt-2 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};