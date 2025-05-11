import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '@/app/loading';

const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

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
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        y: '-100%',
        transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
      }}
    >
      <Loader className="animate-[shimmer_5s_ease-in-out_infinite]" />
    </motion.div>
  );
};

export default SplashScreen;
