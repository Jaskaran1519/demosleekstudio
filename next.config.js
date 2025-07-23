// This file is needed for Next.js to recognize the configuration
// It simply imports and uses the TypeScript configuration

// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'www.vistaprint.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'plus.unsplash.com' },
      { hostname: 'thesleekstudio.com' }
    ]
  },
  experimental: {
    viewTransition: true,
  },
  webpack: (config) => {
    // Ensure proper resolution for path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname
    };
    return config;
  }
};

module.exports = nextConfig; 