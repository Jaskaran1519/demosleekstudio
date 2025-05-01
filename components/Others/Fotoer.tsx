// components/Footer.tsx
import Link from 'next/link';
import { Instagram, Facebook, Phone, ArrowRight, Heart } from 'lucide-react'; // Using Phone icon for WhatsApp

export default function Footer() {
  const currentYear = 2025; // As requested

  return (
    // Changed background to off-black (gray-900), base text to light gray (gray-300)
    <footer className="bg-black text-gray-300 pt-16 pb-8 font-sans relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10"> {/* Ensure content is above the shape */}

        {/* Top Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">

          {/* Column 1: Company Name & CTA */}
          <div className="md:col-span-1 flex flex-col items-start md:items-center space-y-4">
            <Link href="/" className="text-2xl text-white"> {/* Heading text white */}
              Sleek Studio
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-transparent border-[1px] border-white rounded-full transition-colors duration-200"
            >
              Let's Talk
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Column 2: Products */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">Products</h3> {/* Heading text white */}
            <ul className="space-y-2">
              <li>
                {/* Lighter gray links, white on hover */}
                <Link href="/products?category=MEN" className="text-sm text-gray-400 hover:text-white hover:underline">
                  Men Collection
                </Link>
              </li>
              <li>
                <Link href="/products?category=WOMEN" className="text-sm text-gray-400 hover:text-white hover:underline">
                  Women Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">Support</h3> {/* Heading text white */}
            <ul className="space-y-2">
              <li>
                <Link href="/term-conditions" className="text-sm text-gray-400 hover:text-white hover:underline">
                  Term & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">Company</h3> {/* Heading text white */}
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-sm text-gray-400 hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Social & Copyright - Only visible on lg screens in its original position */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center">
            {/* Increased spacing between icons to space-x-6 */}
            <div className="flex space-x-6 mb-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                {/* Slightly darker icon color, white on hover */}
                <Instagram className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <Phone className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
            </div>
            {/* Slightly darker copyright text */}
            <p className="text-xs text-gray-500">Sleek Studio © {currentYear}</p>
          </div>
        </div>

        {/* Social Icons Row - Only visible on md screens, centered on a new line */}
        <div className="hidden md:flex lg:hidden justify-center mb-8">
          <div className="flex flex-col items-center">
            {/* Increased spacing between icons to space-x-6 */}
            <div className="flex space-x-6 mb-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                {/* Slightly darker icon color, white on hover */}
                <Instagram className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <Phone className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
            </div>
            {/* Slightly darker copyright text */}
            <p className="text-xs text-gray-500">Sleek Studio © {currentYear}</p>
          </div>
        </div>

        {/* Social Icons for mobile */}
        <div className="flex md:hidden justify-center mb-8">
          <div className="flex flex-col items-center">
            <div className="flex space-x-6 mb-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <Phone className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
              </Link>
            </div>
            <p className="text-xs text-gray-500">Sleek Studio © {currentYear}</p>
          </div>
        </div>

        {/* Center Section: Rights Reserved & Credit */}
        {/* Adjusted border color for dark mode */}
        <div className="text-center border-t border-gray-700 pt-8 mt-8 mb-20"> {/* Increased margin-bottom to avoid overlap with shape */}
          <p className="text-sm text-gray-400">Sleek Studio all rights reserved</p>
          <p className="text-xs text-gray-500 mt-1">
            made with <Heart className="inline h-3 w-3 text-red-500 fill-current" /> by{' '}
            <a
              href="https://eazweb.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-gray-300" // Adjusted hover color
            >
              Eazweb
            </a>
          </p>
        </div>

      </div>

      {/* Bottom Decorative Shape - Now positioned absolutely at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden z-0">
        {/* The dark background for the shape area is now the footer's bg */}
        {/* Cutout shapes with lighter gray (gray-800) */}
        <div className="absolute bottom-0 left-[10%] h-10 w-[15%] bg-gray-800 rounded-t-full"></div>
        <div className="absolute bottom-0 left-[42.5%] h-10 w-[15%] bg-gray-800 rounded-t-full"></div>
        <div className="absolute bottom-0 left-[75%] h-10 w-[15%] bg-gray-800 rounded-t-full"></div>
      </div>
    </footer>
  );
}