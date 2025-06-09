// components/FadeIn.tsx
'use client'
import { useState, useEffect, useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animationKey?: string | number;
}

const FadeIn = ({ children, className = "", delay = 0, animationKey }: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset visibility when key changes
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [animationKey]); // Re-run effect when animationKey changes

  return (
    <div

      ref={ref}
      className={`transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity',
        transitionTimingFunction: 'ease-in-out'
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
