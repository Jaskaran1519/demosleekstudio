import StylishFontPage from "@/components/Hero/StylishFontPage";
import FadeIn from "@/components/FadeIn";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import Link from "next/link";
import VideoHoverGrid from "@/components/VideoHoverGrid/VideoHoverGrid";
import BendCarousel from "@/components/CircularGallery/BendCarousel";
import Services from "@/components/Hero/Services";
import ContactForm from "@/components/Hero/ContactForm";
import LaunchingSoonPage from "@/components/Launchingpage";

const Page = () => {
  return (
    <div className="w-full max-w-[2000px] mx-auto min-h-screen">
     
     

      {/* <FadeIn>
      <VideoHoverGrid />
      </FadeIn>

      <FadeIn>
      <BendCarousel/>
      </FadeIn>

      <FadeIn>
      <Services/>
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
      <StylishFontPage />
      </FadeIn>

      <FadeIn>
      <ContactForm />
      </FadeIn> */}

    </div>
  );
};
export default Page;
