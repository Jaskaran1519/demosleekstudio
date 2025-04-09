import React from 'react';

interface MainVideoProps {
  videoUrl: string;
  className?: string;
}

export const MainVideo: React.FC<MainVideoProps> = ({ 
  videoUrl,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Container with different aspect ratios for mobile/desktop */}
      <div className="relative w-full aspect-[9/16] sm:aspect-[3/4] md:aspect-video overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
};

export default MainVideo;