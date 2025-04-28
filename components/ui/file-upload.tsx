"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FileUploadProps {
  endpoint: string;
  value?: string;
  onChange: (url: { url: string }) => void;
}

// Maximum file size: 700KB
const MAX_FILE_SIZE = 700 * 1024; // 700KB in bytes

export const FileUpload = ({
  endpoint,
  value = "",
  onChange,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 700KB limit (${(file.size / 1024).toFixed(2)}KB)`);
      toast.error(`File size exceeds 700KB limit (${(file.size / 1024).toFixed(2)}KB)`);
      e.target.value = ''; // Clear the input
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Send base64 to the API
        onChange({ url: reader.result as string });
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
                  PNG, JPG or WebP (Max: 700KB)
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