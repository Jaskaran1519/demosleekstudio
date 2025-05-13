import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import CategoryProducts from '@/components/Category/CategoryProducts';
import { getProductsByCategory } from '@/actions/products';
import React from 'react';

export default async function Page() {
  // Use server action to fetch products by category
  const { products } = await getProductsByCategory('KIDS', 5);
  
  return (
    <div className="w-full max-w-[2400px] min-h-screen">
      <MainVideo videoUrl="https://res.cloudinary.com/dtopsoqao/video/upload/v1743523286/footer-video.42b76d355ecf24bb31c8_l7wrfr.mp4" />
      <CategoryContent category="KIDS" />
      <CategoryProducts products={products} />
    </div>
  );
}