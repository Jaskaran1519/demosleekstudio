"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import StackingCards, { StackingCardItem } from "@/fancy/components/blocks/stacking-cards"
import { canelaFont, magerFont } from "@/app/fonts"
import Link from "next/link"

const cardsData = [
{
bgColor: "bg-[#e6e1d8]",
title: "1989",
description:
"Started 'Aay Ess Suitings'. Just a couple of years before the country set on its course towards economic liberalization, we set foot to change the paradigm of the then-fragmented Indian textile market.",
image:
"https://thesleekstudio.com/static/media/2000.5afa7a014723752fa639.jpg",
},
{
bgColor: "bg-[#d8d0c3]",
title: "2000",
description:
"Founded 'Sleek'. Embracing the tech revolution that took place in the early 2000s, we registered Sleek to set on a course to democratize India's occasion-wear industry.",
image:
"https://thesleekstudio.com/static/media/2000.5afa7a014723752fa639.jpg",
},
{
bgColor: "bg-[#c9c2b3]",
title: "2008",
description:
"Expanded operations under sleek to 100 stores. While the market was in a state of recession in 2008, Sleek remained indifferent and was on an expansion spree with operations & project deliveries across PAN-India.",
image:
"https://thesleekstudio.com/static/media/2000.5afa7a014723752fa639.jpg",
},
{
bgColor: "bg-[#b5aa99]",
title: "2013",
description:
"Ventured as Sleek Studio. With the fast-changing landscape of the Indian couture industry, Sleek was registered as Sleek Studio with the intent to appeal to the contemporary audience with modern embellishments.",
image:
"https://thesleekstudio.com/static/media/2000.5afa7a014723752fa639.jpg",
},
{
bgColor: "bg-[#a39885]",
title: "2021",
description:
"Launched thesleekstudio.com. Keeping our momentum of tailored texture designs intact and setting a foot in the surging Indian eCommerce, we are giving the surefooted off-the-rack millennials of today the required dapper feel through our couture exuding valor, pride, and discipline.",
image:
"https://thesleekstudio.com/static/media/2000.5afa7a014723752fa639.jpg",
},
]

const STACK_OFFSET_REM = 0.2;
const ACTIVE_CARD_STICKY_TOP_VH = 0;

export default function Page() {
const vibrantColors = [
"bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]",
"bg-gradient-to-br from-[#4158D0] to-[#C850C0]",
"bg-gradient-to-br from-[#43E97B] to-[#38F9D7]",
"bg-gradient-to-br from-[#FA8BFF] to-[#2BD2FF]",
"bg-gradient-to-br from-[#8C1BAB] to-[#F85032]",
];

return (
<div className="min-h-screen w-full">
<StackingCards totalCards={cardsData.length + 2}>
<div className="h-screen w-full z-0 text-2xl md:text-6xl font-bold flex flex-col justify-center items-center text-center sticky top-0 px-4">
<h1 className={`${canelaFont.className} text-black mb-4 text-4xl sm:text-5xl md:text-6xl`}>Our Journey</h1>
<p className={`${magerFont.className} text-base md:text-xl text-gray-700 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-8`}>Explore the evolution of Sleek Studio through the years</p>
<div className="animate-bounce text-[#8C1BAB] mt-4">
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14"></path>
<path d="m19 12-7 7-7-7"></path>
</svg>
</div>
</div>

{cardsData.map(({ description, image, title }, loopIndex) => {
      const itemPropIndex = loopIndex + 1; 
      const stickyTopPosition = `calc(${ACTIVE_CARD_STICKY_TOP_VH}vh + ${loopIndex * STACK_OFFSET_REM}rem)`;

      return (
        <StackingCardItem
          key={title}
          index={itemPropIndex}
          style={{ top: stickyTopPosition }} 
          className={cn(
            "h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 md:min-h-[120vh] lg:min-h-[110vh]" 
          )}
        >
          <div
            className={cn(
              vibrantColors[loopIndex % vibrantColors.length], 
              "flex flex-col md:flex-row items-center justify-between",
              "w-full sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl", 
              "max-h-[90vh] sm:max-h-[85vh] md:max-h-[95vh] lg:max-h-none lg:aspect-video", 
              "p-4 py-6 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-white", 
              "border border-white/20" 
            )}
          >
            <div className="flex-1 flex flex-col justify-center w-full md:w-1/2 md:pr-4 lg:pr-8 text-center md:text-left mb-5 md:mb-0 overflow-y-auto custom-scrollbar">
              <h3 className={`${canelaFont.className} font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-3 sm:mb-4`}>{title}</h3>
              <p className={`${magerFont.className} text-sm sm:text-base lg:text-lg leading-relaxed`}>{description}</p>
            </div>

            <div className={cn(
              "w-full max-w-[280px] sm:max-w-xs md:w-1/2 lg:w-2/5 flex-shrink-0", 
              "aspect-square sm:aspect-[4/3] md:max-h-[calc(85vh-4rem)] lg:max-h-none lg:h-full", 
              "relative overflow-hidden rounded-xl mt-5 sm:mt-6 md:mt-0"
            )}>
               {image ? (
                <Image
                  src={image}
                  alt={`Sleek Studio - ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 33vw" 
                />
              ) : (
                <div className="w-full h-full bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-xl border border-white/40">
                  <p className={`${canelaFont.className} text-white font-bold text-center p-4 text-xl sm:text-2xl`}>Sleek Studio {title}</p>
                </div>
              )}
            </div>
          </div>
        </StackingCardItem>
      )
    })}
    
  </StackingCards>

  <div className="w-full flex items-center justify-center pb-12 xl:pt-16">
    <div className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center space-y-4 text-center px-4"> 
      <h2 className={`${canelaFont.className} text-3xl sm:text-4xl md:text-5xl text-black font-bold mb-4 sm:mb-6`}>
        The Future Awaits
      </h2>
      <p className={`${magerFont.className} text-base sm:text-lg md:text-xl text-gray-700`}>
        Join us as we continue to redefine fashion with innovation, quality, and style.
      </p>
     <Link href="/contact" className="bg-black text-white px-6 py-2 rounded-full mt-6">
        Connect
      </Link>
    </div>
  </div>
</div>
)
}