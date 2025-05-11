'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomLoader from './CustomLoader';

const ClientSplashScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure DOM is fully loaded before animations
    document.addEventListener('DOMContentLoaded', () => setIsLoaded(true));
    
    // If already loaded, set it
    if (document.readyState === 'complete') {
      setIsLoaded(true);
    }

    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (hasVisited) {
      // If already visited, don't show splash screen
      setShowSplash(false);
      setIsFirstVisit(false);
      return;
    }

    // Set the visited flag
    localStorage.setItem('hasVisitedBefore', 'true');
    
    // Hide splash screen after exactly 5 seconds
    // Use requestAnimationFrame for smoother animation timing
    const startTime = performance.now();
    let animationFrameId: number;
    
    const checkTime = (currentTime: number) => {
      if (currentTime - startTime >= 5000) {
        setShowSplash(false);
        return;
      }
      animationFrameId = requestAnimationFrame(checkTime);
    };
    
    animationFrameId = requestAnimationFrame(checkTime);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Create a custom shimmer style with GPU acceleration
  const shimmerStyle = {
    willChange: 'transform',
    transform: 'translateZ(0)',
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && isFirstVisit && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            initial={{ opacity: 1 }}
            style={shimmerStyle}
            exit={{ 
              y: '-100%',
              transition: { 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1], // Use a smoother easing curve
                delay: 0.1 // Small delay for better transition
              }
            }}
          >
            <div style={shimmerStyle}>
              <CustomLoader />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default ClientSplashScreen;
