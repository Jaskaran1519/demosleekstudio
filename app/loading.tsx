import React from 'react';
import Image from 'next/image';

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
        <Image
          src="/logo.svg"
          alt="Sleek Studio Logo"
          width={100}
          height={27}
          style={optimizedStyles}
          priority
        />
      </div>
    </div>
  );
};

export default Loader;