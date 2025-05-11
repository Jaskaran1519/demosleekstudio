'use client';

import { Bookmark, HeartIcon, ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchButton from './Search/Searchbutton'
import useCart from '@/store/useCart';
import { Badge } from '@/components/ui/badge';


export const RightSideNavbar = () => {
  const [mounted, setMounted] = useState(false);
  // Get the unique item count instead of total quantities
  const uniqueItemCount = useCart((state) => state.getUniqueItemCount());

  // Only handle the client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='flex items-center gap-4 md:gap-6'>
        <SearchButton/>
        <Link href='/cart' className="relative">
            <ShoppingBagIcon/>
            {mounted && uniqueItemCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 bg-black text-white h-5 w-5 flex items-center justify-center p-0 rounded-full"
              >
                {uniqueItemCount}
              </Badge>
            )}
        </Link>
        <Link href='/wishlist' className='hidden md:flex'>
            <Bookmark/>
        </Link>
    </div>
  )
}

export default RightSideNavbar