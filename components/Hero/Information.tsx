import React from "react";
import Image from "next/image";
import FadeIn from "../FadeIn";
import { Container } from "../ui/container";
import { asulFont, canelaFont, logoFont, magerFont } from "@/app/fonts";

const Information: React.FC = () => {
  return (
    <Container className="py-5 md:py-16">
      <div className="flex flex-col md:flex-row items-start gap-8 ">
        
        <div className={` ${canelaFont.className} w-full md:w-1/2`}>
          <p className="text-4xl md:text-5xl xl:text-8xl font-light md:leading-[1.3] lg:leading-[1.3] xl:leading-[1.3] -pt-4 md:-pt-8 lg:-pt-12 xl:-pt-16 md:text-right">
            Carved with pure <br /> 
            Experience
          </p>
          <Image src="https://res.cloudinary.com/dtopsoqao/image/upload/v1745406309/jeshs238fus80tu9mrqy_dtlctb.webp" className="w-full hidden md:block md:pt-20 lg:pt-28 xl:pt-36" alt="" width={2000} height={2000} />
          <div className="text-2xl md:text-4xl xl:text-5xl hidden md:block font-light md:leading-[1.3] lg:leading-[1.3] xl:leading-[1.3] pt-5 xl:pt-10 md:text-right">
            <p>Honouring tradition, <br /> maintaining a progressive outlook</p>
          </div> 
        </div>
        <div className="w-full md:w-1/2 ">
          <div className={`max-w-md mx-auto md:px-5 xl:px-12 ${magerFont.className} `}>
            <p className="text-lg md:text-xl xl:text-2xl leading-relaxed text-gray-700">
            With decades at the office, our designs are driven by the philosophy that amalgamates modern embellishments with Indian narrative, catering to contemporary off-the-rack shoppers around the world. <br /> <br /> Each garment tells a story of cultural heritage reimagined through a lens of sophistication and timeless elegance. Our commitment to exceptional craftsmanship ensures that every piece not only fits perfectly but becomes an expression of individual style and refined taste.
            </p>
          </div>
          <Image src="https://res.cloudinary.com/dtopsoqao/image/upload/v1745406307/skqpk8pnpi9vc0cifp52_s7vsfx.webp" className="w-full pt-8 md:pt-14 xl:pt-20" alt="" width={2000} height={2000} />
          
        </div>
      </div>
    </Container>
  );
};

export default Information;