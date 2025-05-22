import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param file The file to upload
 * @param folder The folder to upload to
 * @returns The upload result
 */
export async function uploadImage(file: string, folder = "sleek-studio/products") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    // Add optimization parameters to the URL
    // Original URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    // Optimized URL format: https://res.cloudinary.com/cloud_name/image/upload/q_auto,f_auto/v1234567890/folder/public_id.ext
    const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');

    return {
      url: optimizedUrl,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId The public ID of the image to delete
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    if (!url) return null;
    
    // Handle both standard and optimized URLs
    // Standard: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    // Optimized: https://res.cloudinary.com/cloud_name/image/upload/q_auto,f_auto/v1234567890/folder/public_id.ext
    
    // First, normalize the URL by removing any transformation parameters
    const normalizedUrl = url.replace('/upload/q_auto,f_auto/', '/upload/');
    
    // Then extract the public ID
    const regex = /\/v\d+\/(.+)\./;
    const match = normalizedUrl.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
} 