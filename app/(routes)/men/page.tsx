import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import React from 'react';
import CategoryProducts from '@/components/Category/CategoryProducts';

export default async function Page() {
  // Fetch products from the API endpoint instead of server action
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/category/MEN?limit=5`, {
    cache: 'no-store'
  });
  const data = await response.json();
  const products = data.products;

  return (
    <div className="w-full max-w-[2000px] min-h-screen">
      <MainVideo videoUrl="https://res.cloudinary.com/dtopsoqao/video/upload/v1743523286/footer-video.42b76d355ecf24bb31c8_l7wrfr.mp4" />
      <CategoryContent category="MEN" />
      <CategoryProducts products={products} />
    </div>
  );
}