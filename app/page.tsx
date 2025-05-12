import { CarouselDemo } from "@/components/Hero/Carousel";
import CategorySection from "@/components/Hero/CategorySection";
import BestSellers from "@/components/Hero/BestSellers";
import Information from "@/components/Hero/Information";
import { Reviews } from "@/components/Hero/Reviews";
import StylishFontPage from "@/components/Hero/StylishFontPage";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import MainVideo from "@/components/Others/MainVideo";
import AnimatedContact from "@/components/Hero/AnimatedContact";
import BespokeTailoring from "@/components/Hero/Bespoke";
import FadeIn from "@/components/FadeIn";
import MenGrid from "@/components/Hero/Grids/MenGrid";
import WomenGrid from "@/components/Hero/Grids/WomenGrid";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import Faq from "@/components/Hero/Faq";
import Link from "next/link";
import { HeroBackground } from "@/components/Hero/HeroBackground";
const Page = () => {
  return (
    <div className="w-full max-w-[2000px] mx-auto min-h-screen">
      <HeroBackground/>
      {/* <MainVideo videoUrl="https://res.cloudinary.com/dk6z5ui4f/video/upload/v1743748072/1-Hero-DSK_hua8cn.mp4" /> */}
      {/* <CarouselDemo/> */}
      {/* <VelocityScroll>Sleek Studio</VelocityScroll> */}
      {/* <hr className="border-[2px] border-black mx-5" /> */}
      {/* <FadeIn>
        <CategorySection />
      </FadeIn> */}
      <FadeIn>
        <Information/>
      </FadeIn>

      <FadeIn>
        <FeaturedProductsCarousel />
        <div className="py-5 flex justify-center items-center">
          <Link href='/products'>
          <button className="px-4 py-2 border-[1px] border-black bg-transparent hover:rounded-lg duration-500 hover:bg-black hover:text-white">Explore More</button>
          </Link>
        </div>
      </FadeIn>

      <FadeIn>
        <BespokeTailoring />
      </FadeIn>

      {/* <FadeIn>
        <Faq/>
      </FadeIn> */}

      <FadeIn>
        <StylishFontPage />
      </FadeIn>
      {/* <Reviews/> */}
    </div>
  );
};
export default Page;
