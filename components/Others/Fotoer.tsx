// components/Footer.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { magerFont } from '@/app/fonts';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Don't render footer on auth routes or admin routes
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-gray-100 text-gray-800 pt-12 pb-8 md:pt-16  font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo, Middle Text, Right Links */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 mb-8 md:mb-16 lg:mb-24">
          {/* Top Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Sleek Studio Home">
              {/* Adjust width and height as per your logo's aspect ratio */}
              <Image src="/logo.svg" alt="Sleek Studio Logo" width={140} height={35} className="h-auto" />
            </Link>
          </div>

          {/* Middle Text */}
          <div className={`text-center  md:flex-1 md:max-w-md md:pt-14 lg:max-w-lg text-gray-500 text-sm md:text-md lg:text-lg xl:text-xl sm:text-base leading-relaxed ${magerFont.className}`}>
            <p>
            Our legacy isn't built on fleeting trends or revenues, but on establishing ourselves as the leading name in exquisite Indian formal and traditional party wear            </p>
          </div>

          {/* Top Right: Links */}
          <nav className={`text-center md:text-right ${magerFont.className} `}>
            <ul className="space-y-3 md:space-y-2 text-md sm:text-lg md:text-xl lg:text-2xl ">
              <li>
                <Link href="/products" className="text-gray-700 hover:text-black transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/privacy-and-terms" className="text-gray-700 hover:text-black transition-colors">
                  Privacy & Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sleekstudio" className="text-gray-700 hover:text-black transition-colors">
                  About
                </Link>
              </li>
            </ul>
            {/* <div className="text-center md:text-right text-xs text-black mt-12 md:mt-16">
          <p>
            Website by{' '}
            <a
              href="https://eazweb.in" // Or your desired link
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              Eazweb
            </a>
          </p>
        </div> */}
          </nav>
        </div>

        {/* Bottom Large Text - Logo Image with golden mask */}
        <div className="text-center">
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#dab188',
              maskImage: 'url(/logo-text.png)',
              WebkitMaskImage: 'url(/logo-text.png)',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          >
            <img
              src="/logo-text.png"
              alt="Sleek Studio"
              className="h-[60px] sm:h-[80px] md:h-[90px] lg:h-[110px] xl:h-[140px] 2xl:h-[200px] w-auto"
              style={{ visibility: 'hidden' }}
            />
          </div>
        </div>

        {/* Optional: If you want to add a small credit line at the very bottom */}
        
        
       
      </div>
    </footer>
  );
}