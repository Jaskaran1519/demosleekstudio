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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2 text-foreground focus:outline-none cursor-pointer" 
        aria-label="Open menu"
      >
        <Menu size={24} className='text-black' />
      </button>
      
      {/* Overlay */}
      <div 
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* Slide-in Menu - Changed to left side */}
      <div 
        className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ position: 'fixed' }}
      >
        {/* Menu Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold">Sleek Studio</h2>
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