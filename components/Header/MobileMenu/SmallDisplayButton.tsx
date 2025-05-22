'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ShoppingBag, LogIn, UserPlus, LayoutDashboard, Menu, AlignLeft } from 'lucide-react';
import styles from './style.module.scss';
import Image from 'next/image';
import { canelaFont } from '@/app/fonts';

// Animation variants
const transition = {duration: 1, ease: [0.76, 0, 0.24, 1]};

const opacity = {
  initial: {
    opacity: 0
  },
  open: {
    opacity: 1,
    transition: {duration: 0.35}
  },
  closed: {
    opacity: 0,
    transition: {duration: 0.35}
  }
};

const background = {
  initial: {
    height: 0
  },
  open: {
    height: "100vh",
    transition
  },
  closed: {
    height: 0,
    transition
  }
};

const height = {
  initial: {
    height: 0
  },
  enter: {
    height: "auto",
    transition
  },
  exit: {
    height: 0,
    transition
  }
};

const blur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1
  },
  open: {
    filter: "blur(4px)",
    opacity: 0.6,
    transition: {duration: 0.3}
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {duration: 0.3}
  }
};

// Responsive blur effect - only applies on large screens
const responsiveBlur = {
  initial: {
    filter: "blur(0px)",
    opacity: 1
  },
  open: {
    filter: "blur(0px)", // No blur on small/medium screens
    opacity: 1,
    transition: {duration: 0.3},
    '@media (min-width: 1024px)': { // lg breakpoint
      filter: "blur(4px)",
      opacity: 0.6,
    }
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {duration: 0.3}
  }
};

const translate = {
  initial: {
    y: "100%",
    opacity: 0
  },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i}
  }),
  exit: (i: number) => ({
    y: "100%",
    opacity: 0,
    transition: {duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i}
  })
};

// Menu links
const links = [
  {
    title: "Men",
    href: "/men"
  },
  {
    title: "Women",
    href: "/women"
  },
  {
    title: "Wishlist",
    href: "/wishlist"
  },
  {
    title: "About",
    href: "/about-us"
  },
  {
    title: "Contact Us",
    href: "/contact"
  }
];

export default function SmallDisplayButton({scrolled, shouldBeFixed}: {scrolled: boolean, shouldBeFixed: boolean}) {
  const [isActive, setIsActive] = useState(false);
  const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAuthenticated = status === "authenticated";
  
  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsActive(false);
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isActive) {
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
  }, [isActive]);

  // Character animation function
  const getChars = (word: string) => {
    let chars = [] as any;
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span 
          custom={[i * 0.02, (word.length - i) * 0.01]} 
          variants={translate} 
          initial="initial" 
          animate="enter" 
          exit="exit" 
          key={char + i}>
          {char}
        </motion.span>
      );
    });
    return chars;
  };
  
  // Handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsActive(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.bar}>
        <div onClick={() => {setIsActive(!isActive)}} className={styles.el}>
          <AlignLeft className="h-8 w-8" />
          {/* Removed Menu text as requested */}
        </div>
      </div>
      
      <motion.div 
        variants={background} 
        initial="initial" 
        animate={isActive ? "open" : "closed"} 
        className={styles.background}
        style={{
          backgroundColor: 'black',
          opacity: 0.5,
          height: '100%',
          width: '100vw',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 40
        }}
        onClick={() => setIsActive(false)} // Close menu when clicking on the overlay
      />
      
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div 
            variants={height} 
            initial="initial" 
            animate="enter" 
            exit="exit" 
            className={styles.nav}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100vh',
              overflowY: 'auto',
              zIndex: 50
            }}
          >
            <div className={styles.wrapper}>
              <div className={styles.container}>
                {/* Close button at the top */}
                <div className="flex justify-between items-center w-full mb-8">
                  <Image src="/logo.svg" alt="Logo" width={25} height={25} />
                  <button 
                    onClick={() => setIsActive(false)} 
                    className="text-black p-2 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-row w-full">
                  {/* Left side - Menu Options */}
                  <div className={styles.body}>
                    {links.map((link, index) => {
                      const { title, href } = link;
                      return (
                        <Link key={`l_${index}`} href={href} className={`${canelaFont.className}`} onClick={() => setIsActive(false)}>
                          <motion.p 
                            onMouseOver={() => {setSelectedLink({isActive: true, index})}} 
                            onMouseLeave={() => {setSelectedLink({isActive: false, index})}} 
                            variants={responsiveBlur} 
                            animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}
                          >
                            {getChars(title)}
                          </motion.p>
                        </Link>
                      );
                    })}
                    
                    {/* Admin option removed from left side as requested */}
                  </div>
                  
                  {/* Right side - User Authentication */}
                  <div className="ml-auto flex flex-col gap-4 items-end">
                    {isAuthenticated ? (
                      <>
                        <div className="flex flex-col gap-3 w-full">
                          {isAdmin && (
                            <button 
                              onClick={() => {
                                router.push("/admin");
                                setIsActive(false);
                              }}
                              className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full"
                            >
                              <span>Admin Dashboard</span>
                              <LayoutDashboard className="h-4 w-4 ml-2" />
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              router.push("/profile");
                              setIsActive(false);
                            }}
                            className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full"
                          >
                            <span>Profile</span>
                            <User className="h-4 w-4 ml-2" />
                          </button>
                          <button 
                            onClick={() => {
                              router.push("/profile?tab=orders");
                              setIsActive(false);
                            }}
                            className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full"
                          >
                            <span>Orders</span>
                            <ShoppingBag className="h-4 w-4 ml-2" />
                          </button>
                          <button 
                            onClick={handleSignOut}
                            className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full mt-2"
                          >
                            <span>Log out</span>
                            <LogOut className="h-4 w-4 ml-2" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-medium mb-3 text-right">Welcome</div>
                        <div className="flex flex-col gap-3 w-full">
                          <button 
                            onClick={() => {
                              router.push("/auth/signin");
                              setIsActive(false);
                            }}
                            className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full"
                          >
                            <span>Sign in</span>
                            <LogIn className="h-4 w-4 ml-2" />
                          </button>
                          <button 
                            onClick={() => {
                              router.push("/auth/signup");
                              setIsActive(false);
                            }}
                            className="flex items-center justify-end gap-2 text-black hover:text-gray-600 border border-gray-200 rounded-md px-4 py-2 transition-all hover:border-gray-400 w-full"
                          >
                            <span>Register</span>
                            <UserPlus className="h-4 w-4 ml-2" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pt-10">
                  <p className="text-xs text-center">© SLEEK STUDIO 2025</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}