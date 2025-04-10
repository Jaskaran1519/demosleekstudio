'use client'
import React, { useState, useEffect } from 'react';
import SmallDisplayButton from './MobileMenu/SmallDisplayButton';
import RightSideNavbar from './RightSideNavbar';
import { NavigationMenuDemo } from './NavigationMenuDemo';
import { usePathname } from "next/navigation";
import Image from 'next/image';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = React.useRef(0);
  
  const pathname = usePathname();
  
  // Check if current route is one where navbar should be fixed (not taking space)
  const fixedPositionRoutes = ['/', '/men', '/women', '/kidswear'];
  const shouldBeFixed = fixedPositionRoutes.includes(pathname);
  
  // Check if it's an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold for styling
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Determine visibility based on scroll direction
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        // Scrolling down & past initial threshold - hide navbar
        setVisible(false);
      } else {
        // Scrolling up or at the top - show navbar
        setVisible(true);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove lastScrollY from dependencies

  // Don't render navbar on admin routes
  if (isAdminRoute) {
    return null;
  }
  
  // Set position based on route
  const positionClass = shouldBeFixed ? 'fixed' : 'sticky';
  
  return (
    <div 
      className={`w-full z-30 ${positionClass} top-0 px-3 md:px-6 flex justify-between items-center py-3 transition-transform duration-300 ${
        scrolled ? 'text-black bg-white ' : shouldBeFixed ? 'text-white bg-transparent' : 'text-black bg-white'
      } ${!visible ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Left section - takes 1/3 width */}
      <div className='flex w-1/3 justify-start'>
        <SmallDisplayButton scrolled={scrolled} shouldBeFixed={shouldBeFixed} />
      </div>
      
      {/* Center section - takes 1/3 width */}
      <div className='flex w-1/3 justify-center gap-2 items-center'>
        <Image src="/logo.svg" alt="logo" width={40} height={40} className='w-12 h-12 md:w-8 md:h-8' />
        <h1 className='text-2xl  hidden md:flex'>SLEEK STUDIO</h1>
      </div>
      
      {/* Right section - takes 1/3 width */}
      <div className='flex w-1/3 justify-end'>
        <RightSideNavbar />
      </div>
    </div>
  );
};

export default Navbar;