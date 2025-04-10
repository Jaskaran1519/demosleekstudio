// app/(routes)/wishlist/page.tsx

"use client";

import { Container } from '@/components/ui/container';
import React from 'react';
import useWishlist from '@/store/useWishlist';
import ProductCard from '@/components/Others/ProductCard';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Page() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <Container>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Wishlist</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 max-w-md">Start adding items to your wishlist to keep track of products you love. They'll be saved here for when you're ready to purchase.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Wishlist</h1>
          <p className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard 
                product={{
                  id: item.productId,
                  slug: item.slug,
                  name: item.name,
                  price: item.price,
                  noBgImage: item.image,
                  modelImage: item.image,
                  images: [item.image],
                  category: item.category,
                  clothType: item.clothType,
                  description: '',
                  isActive: true,
                  inventory: 0,
                  sizes: [],
                  tags: [],
                  salePrice: null,
                  homePageFeatured: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  wishedByIds: [],
                }} 
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                onClick={() => removeItem(item.productId)}
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}