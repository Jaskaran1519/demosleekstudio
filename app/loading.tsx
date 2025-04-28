// components/ShimmerLoader.tsx
import React from 'react';

interface ShimmerLoaderProps {
  className?: string;
  // You can add props to control blur amount or background overlay color if needed
  // e.g., blurAmount?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const Loader: React.FC<ShimmerLoaderProps> = ({ className = '' }) => {
  return (
    // --- Fullscreen Container with Backdrop Blur ---
    <div
      className={`
        fixed inset-0  // Position fixed to cover the whole viewport
        z-50           // Ensure it's on top of other content
        flex items-center justify-center // Center the text within the container

        // --- Glassy Effect ---
        bg-black/10       // Subtle semi-transparent overlay (optional, enhances blur visibility)
        dark:bg-white/5   // Optional dark mode variant for the overlay
        backdrop-blur-md  // Apply the backdrop blur effect (adjust md to sm, lg, xl etc.)

        ${className}     // Allow passing additional classes
      `}
      // Add aria attributes for accessibility if it's a true loading state
      role="status"
      aria-live="polite"
    >
      {/* The Shimmering Text (no changes needed here for the backdrop effect) */}
      <h1
        className="
          text-4xl md:text-6xl
          font-bold
          tracking-tight

          // Shimmer styles remain the same
          bg-gradient-to-r from-black via-gray-300 to-black
          dark:from-white dark:via-gray-600 dark:to-white

          bg-[length:200%_100%]
          bg-clip-text
          text-transparent
          animate-shimmer
        "
        // Hide from screen readers if the parent container announces the status
        aria-hidden="true"
      >
        Sleek Studio
      </h1>
    </div>
  );
};

export default Loader;