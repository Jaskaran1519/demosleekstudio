'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

const ClientSplashScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure DOM is fully loaded before animations
    document.addEventListener('DOMContentLoaded', () => setIsLoaded(true));
    
    // If already loaded, set it
    if (document.readyState === 'complete') {
      setIsLoaded(true);
    }
    
    // Hide splash screen after exactly 3 seconds
    // Use requestAnimationFrame for smoother animation timing
    const startTime = performance.now();
    let animationFrameId: number;
    
    const checkTime = (currentTime: number) => {
      if (currentTime - startTime >= 2000) {
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

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            exit={{ 
              y: '-100%',
              transition: { 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1],
                delay: 0.1
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: 'easeIn' }}
            >
              <Image
                src="/logo.svg"
                alt="Sleek Studio Logo"
                width={100}
                height={27}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default ClientSplashScreen;
