import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import React from 'react';
import CategoryProducts from '@/components/Category/CategoryProducts';
import { getProductsByCategory } from '@/actions/products';

export default async function Page() {
  // Use server action to fetch products by category
  const { products } = await getProductsByCategory('WOMEN', 5);
  
  return (
    <div className="w-full max-w-[2400px] min-h-screen">
      <MainVideo videoUrl="https://res.cloudinary.com/dtopsoqao/video/upload/v1743768525/l9k2mtah0ergcn8go6lr.mp4" />
      <CategoryContent category="WOMEN" />
      <CategoryProducts products={products} />
    </div>
  );
}