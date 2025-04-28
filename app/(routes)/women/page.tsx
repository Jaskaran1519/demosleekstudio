import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import React from 'react';
import CategoryProducts from '@/components/Category/CategoryProducts';

export default async function Page() {
  // Fetch products from the API endpoint instead of server action
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/category/WOMEN`, {
    cache: 'no-store'
  });
  const data = await response.json();
  const products = data.products;
  
  return (
    <div className="w-full max-w-[2400px] min-h-screen">
      <MainVideo videoUrl="https://res.cloudinary.com/dtopsoqao/video/upload/v1743768525/l9k2mtah0ergcn8go6lr.mp4" />
      <CategoryContent category="WOMEN" />
      <CategoryProducts products={products} />
    </div>
  );
}