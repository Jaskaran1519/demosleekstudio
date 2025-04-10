import MainVideo from '@/components/Others/MainVideo';
import CategoryContent from '@/components/Category/CategoryContent';
import React from 'react';
import { getCategoryProducts } from '@/actions/products';
import CategoryProducts from '@/components/Category/CategoryProducts';
export default async function Page() {

  const { products } = await getCategoryProducts('MEN', 5)
  console.log(products)
  return (
    <div className="w-full max-w-[2000px] min-h-screen">
      <MainVideo videoUrl="https://res.cloudinary.com/dtopsoqao/video/upload/v1743523286/footer-video.42b76d355ecf24bb31c8_l7wrfr.mp4" />
      <CategoryContent category="MEN" />
      <CategoryProducts products={products} />
    </div>
  );
}