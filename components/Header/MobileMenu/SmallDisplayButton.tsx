'use client'

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { menuData } from '@/config/mobilemenu';
import MobileMenu from './MobileMenu';

export default function LightweightMobileMenu({scrolled, shouldBeFixed}: {scrolled: boolean, shouldBeFixed: boolean}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Apply fixed positioning to body with the current scroll position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore the scroll position when closing the menu
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      // Cleanup function to ensure body styles are reset
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 focus:outline-none cursor-pointer" 
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" width="50" height="18" fill="currentColor">
          <title>Custom Menu Icon (Left-Aligned)</title>
          <rect x="0" y="0" width="44" height="3" rx="1" ry="1"/> 
          <rect x="0" y="14" width="30" height="3" rx="1" ry="1"/> 
        </svg>
      </button>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        style={{ position: 'fixed' }}
      />
      
      {/* Slide-in Menu */}
      <div 
        className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm bg-white z-[101] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ position: 'fixed' }}
      >
        {/* Menu Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl text-black">SLEEK STUDIO</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 text-foreground focus:outline-none"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Custom Menu Items Component */}
        <div className="bg-white h-[calc(100vh-73px)] overflow-y-auto text-black">
          <MobileMenu items={menuData} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}