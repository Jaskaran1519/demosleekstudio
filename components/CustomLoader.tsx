'use client';

import React from 'react';
import Loader from '@/app/loading';

interface CustomLoaderProps {
  className?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ className = '' }) => {
  // Add inline styles for performance optimization
  const optimizedStyles = {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force GPU acceleration
    backfaceVisibility: 'hidden' as 'hidden',
  };
  
  return (
    <div style={optimizedStyles} className={className}>
      {/* We're using a custom class for the 5-second shimmer animation */}
      <Loader />
    </div>
  );
};

export default CustomLoader;
