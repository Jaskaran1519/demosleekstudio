import { CarouselDemo } from '@/components/Hero/Carousel'
import CategorySection from '@/components/Hero/CategorySection'
import BestSellers from '@/components/Hero/BestSellers'
import Information from '@/components/Hero/Information'
import { Reviews } from '@/components/Hero/Reviews'
import StylishFontPage from '@/components/Hero/StylishFontPage'
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity'
import MainVideo from '@/components/Others/MainVideo'
import AnimatedContact from '@/components/Hero/AnimatedContact'
import FeaturedProductsContent from '@/components/Hero/FeaturedProductsContent'
import BespokeTailoring from '@/components/Hero/Bespoke'
const Page = () => {
  return (
    <div className='w-full max-w-[2400px]'>
      <MainVideo videoUrl = "https://res.cloudinary.com/dk6z5ui4f/video/upload/v1743748072/1-Hero-DSK_hua8cn.mp4" />
      {/* <CarouselDemo/> */}
      <VelocityScroll>Sleek Studio</VelocityScroll>
      <hr className='border-[2px] border-black mx-5' />
      <BestSellers/>
      <Information/>
      <CategorySection/>
      <FeaturedProductsContent/>
      <div className='relative overflow-hidden'>
      <AnimatedContact/>
      </div>
      <BespokeTailoring/>
      <StylishFontPage/>
      {/* <Reviews/> */}
    </div>
  )
}
export default Page