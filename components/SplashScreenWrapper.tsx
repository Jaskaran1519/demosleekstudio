'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/app/loading';

const SplashScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasAnimationCompleted, setHasAnimationCompleted] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (hasVisited) {
      // If already visited, don't show splash screen
      setShowSplash(false);
      return;
    }

    // Set the visited flag
    localStorage.setItem('hasVisitedBefore', 'true');
    
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => setHasAnimationCompleted(true)}
      >
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ 
              y: '-100%',
              transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
            }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default SplashScreenWrapper;
