'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface VideoItem {
  id: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  route: string;
}

const VideoHoverGrid = () => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const router = useRouter();
  
  // Function to handle video refs
  const setVideoRef = (id: string) => (el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  };

  const videos: VideoItem[] = [
    {
      id: 'men',
      videoUrl: '/mainvideos/ssmenvideo.webm',
      title: "Men's Collection",
      subtitle: 'Shop now',
      route: '/men',
    },
    {
      id: 'women',
      videoUrl: '/mainvideos/sswomenvideo.webm',
      title: "Women's Collection",
      subtitle: 'Shop now',
      route: '/women',
    },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Pause all videos when component unmounts
      videoRefs.current.forEach(video => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };
  }, []);

  // Handle hover state changes
  const handleHoverStart = (id: string) => {
    setHoveredVideo(id);
    const video = videoRefs.current.get(id);
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore the error if it's due to the video being paused by the user
          if (error.name !== 'AbortError') {
            console.error('Error playing video:', error);
          }
        });
      }
    }
  };

  const handleHoverEnd = (id: string) => {
    const video = videoRefs.current.get(id);
    if (video) {
      video.pause();
    }
    setHoveredVideo(null);
  };

  // Handle navigation
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Sleek Studio Text Overlay - Hidden on mobile */}
      <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center z-10 text-white text-center pointer-events-none">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">Sleek</h1>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">Studio</h1>
      </div>

      {/* Video Grid */}
      <div className="w-full h-full">
        <div className="flex flex-col md:flex-row w-full h-full">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              className="relative w-full md:w-1/2 h-full overflow-hidden"
              onHoverStart={() => handleHoverStart(video.id)}
              onHoverEnd={() => handleHoverEnd(video.id)}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 z-0"></div>
              
              {/* Video Element */}
              <video
                ref={setVideoRef(video.id)}
                className="w-full h-full object-cover z-0"
                muted
                loop
                playsInline
                preload="metadata"
                onPause={() => {}}
                onPlay={() => {}}
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Text Overlay - Positioned at bottom center */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 px-4 text-center">
                <motion.div 
                  className="w-full max-w-xs"
                  initial={{ opacity: 0.9, y: 20 }}
                  animate={{ 
                    opacity: hoveredVideo === video.id ? 0.9 : 0.7,
                    y: hoveredVideo === video.id ? 0 : 20,
                    scale: hoveredVideo === video.id ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg"
                  >
                    {video.title}
                  </motion.h3>
                  <div className="relative group">
                    <button
                      className="relative text-white text-sm font-medium tracking-wider pb-1 cursor-pointer"
                      onClick={() => handleNavigation(video.route)}
                    >
                      {video.subtitle}
                      <span className="absolute bottom-0 left-0 w-full h-px bg-white transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoHoverGrid;