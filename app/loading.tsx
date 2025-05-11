import React from 'react';

interface ShimmerLoaderProps {
  className?: string;
}

const Loader: React.FC<ShimmerLoaderProps> = ({ className = '' }) => {
  // Add inline styles for performance optimization
  const optimizedStyles = {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force GPU acceleration
    backfaceVisibility: 'hidden' as 'hidden',
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 ${className}`}
      style={optimizedStyles}
    >
      {/* Blurred background layer - reduced blur for better performance */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-white/95 dark:bg-black/95"
        aria-hidden="true"
        style={optimizedStyles}
      />
      
      {/* Content layer with sharp text */}
      <div 
        className="relative z-10 h-full w-full flex items-center justify-center"
        style={optimizedStyles}
      >
        <h1
          className="
            text-4xl md:text-6xl lg:text-7xl xl:text-8xl
            font-bold
            tracking-tight
            text-center
            bg-gradient-to-r from-black via-gray-300 to-black
            dark:from-white dark:via-gray-600 dark:to-white
            bg-[length:200%_100%]
            bg-clip-text
            text-transparent
            animate-shimmer
          "
          role="status"
          aria-live="polite"
          style={optimizedStyles}
        >
          Sleek Studio
        </h1>
      </div>
    </div>
  );
};

export default Loader;