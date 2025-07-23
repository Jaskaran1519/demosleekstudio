import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import React from 'react';
import CategoryProducts from '@/components/Category/CategoryProducts';
import { getProductsByCategory } from '@/actions/products';

export default async function Page() {
  // Use server action to fetch products by category
  const { products } = await getProductsByCategory('MEN', 5);

  return (
    <div className="w-full max-w-[2000px] min-h-screen">
      <MainVideo videoUrl="/videos/menpagevideo.mp4" />
      <CategoryContent category="MEN" />
      <CategoryProducts products={products} />
    </div>
  );
}