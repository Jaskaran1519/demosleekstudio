// author: Khoa Phan <https://www.pldkhoa.dev>

"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import StackingCards, { StackingCardItem } from "@/fancy/components/blocks/stacking-cards"
import { canelaFont, magerFont } from "@/app/fonts"

const cards = [
  {
    bgColor: "bg-[#e6e1d8]",
    title: "1989",
    description:
      "Started 'Aay Ess Suitings'. Just a couple of years before the country set on its course towards economic liberalization, we set foot to change the paradigm of the then-fragmented Indian textile market.",
    image:
      "/images/about/1989.jpg",
  },
  {
    bgColor: "bg-[#d8d0c3]",
    title: "2000",
    description:
      "Founded 'Sleek'. Embracing the tech revolution that took place in the early 2000s, we registered Sleek to set on a course to democratize India's occasion-wear industry.",
    image:
      "/images/about/2000.jpg",
  },
  {
    bgColor: "bg-[#c9c2b3]",
    title: "2008",
    description:
      "Expanded operations under sleek to 100 stores. While the market was in a state of recession in 2008, Sleek remained indifferent and was on an expansion spree with operations & project deliveries across PAN-India.",
    image:
      "/images/about/2008.jpg",
  },
  {
    bgColor: "bg-[#b5aa99]",
    title: "2013",
    description:
      "Ventured as Sleek Studio. With the fast-changing landscape of the Indian couture industry, Sleek was registered as Sleek Studio with the intent to appeal to the contemporary audience with modern embellishments.",
    image:
      "/images/about/2013.jpg",
  },
  {
    bgColor: "bg-[#a39885]",
    title: "2021",
    description:
      "Launched thesleekstudio.com. Keeping our momentum of tailored texture designs intact and setting a foot in the surging Indian eCommerce, we are giving the surefooted off-the-rack millennials of today the required dapper feel through our couture exuding valor, pride, and discipline.",
    image:
      "/images/about/2021.jpg",
  },
]

export default function page() {
  // Use the window as the scroll container instead of a specific element
  return (
    <div className="bg-white min-h-screen">
      <StackingCards totalCards={cards.length + 2}>
        {/* Intro section */}
        <div className="h-screen w-full z-0 text-2xl md:text-6xl font-bold flex flex-col justify-center items-center text-center sticky top-0">
          <h1 className={`${canelaFont.className} text-black mb-4`}>Our Journey</h1>
          <p className={`${magerFont.className} text-base md:text-xl text-gray-700 max-w-md mx-auto px-4 mb-8`}>Explore the evolution of Sleek Studio through the years</p>
          <div className="animate-bounce text-[#8C1BAB]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        {/* Timeline cards */}
        {cards.map(({ bgColor, description, image, title }, index) => {
          // More vibrant colors
          const vibrantColors = [
            "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]", // Vibrant coral to orange
            "bg-gradient-to-br from-[#4158D0] to-[#C850C0]", // Vibrant blue to purple
            "bg-gradient-to-br from-[#43E97B] to-[#38F9D7]", // Vibrant green to teal
            "bg-gradient-to-br from-[#FA8BFF] to-[#2BD2FF]", // Vibrant pink to blue
            "bg-gradient-to-br from-[#8C1BAB] to-[#F85032]", // Vibrant purple to red
          ];
          
          return (
            <StackingCardItem key={index} index={index + 1} className="min-h-screen py-16">
              <div
                className={cn(
                  vibrantColors[index % vibrantColors.length],
                  "h-[70%] sm:h-[60%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-10/12 rounded-3xl mx-auto relative shadow-lg z-10",
                )}
              >
                <div className="flex-1 flex flex-col justify-center text-white">
                  <h3 className={`${canelaFont.className} font-bold text-4xl md:text-5xl mb-5 text-center sm:text-left`}>{title}</h3>
                  <p className={`${magerFont.className} text-lg md:text-xl text-center sm:text-left`}>{description}</p>
                </div>

                <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden mt-6 sm:mt-0">
                  <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl border border-white/30">
                    <p className={`${canelaFont.className} text-white font-bold text-center p-4 text-2xl`}>Sleek Studio {title}</p>
                  </div>
                </div>
              </div>
            </StackingCardItem>
          )
        })}

        {/* Final section */}
        <StackingCardItem index={cards.length + 1} className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 z-10 relative">
            <h2 className={`${canelaFont.className} text-4xl md:text-6xl text-black font-bold mb-6`}>
              The Future Awaits
            </h2>
            <p className={`${magerFont.className} text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto`}>
              Join us as we continue to redefine fashion with innovation, quality, and style.
            </p>
          </div>
        </StackingCardItem>
      </StackingCards>
    </div>
  )
}
