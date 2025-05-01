import React from 'react';

interface ShimmerLoaderProps {
  className?: string;
}

const Loader: React.FC<ShimmerLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Blurred background layer */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-black/10 dark:bg-white/5"
        aria-hidden="true"
      />
      
      {/* Content layer with sharp text */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <h1
          className="
            text-4xl md:text-6xl lg:text-7xl xl:text-8xl
            font-bold
            tracking-tight
            
            bg-gradient-to-r from-black via-gray-300 to-black
            dark:from-white dark:via-gray-600 dark:to-white
            bg-[length:200%_100%]
            bg-clip-text
            text-transparent
            animate-shimmer
          "
          role="status"
          aria-live="polite"
        >
          Sleek Studio
        </h1>
      </div>
    </div>
  );
};

export default Loader;