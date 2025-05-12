import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['images.pexels.com','lh3.googleusercontent.com','plus.unsplash.com','thesleekstudio.com'], // Allow images from Pexels
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
