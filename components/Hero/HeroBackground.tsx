"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import { canelaFont } from "@/app/fonts";
import Link from "next/link";
import Image from "next/image";

export function HeroBackground() {
  return (
    <AuroraBackground className="bg-[#f5efe6] dark:bg-[#e8d9c5]">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center px-4"
      >
        <Image src='/logo.svg' alt="logo" width={50} height={50} />
        <div className={`${canelaFont.className} text-white text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 text-center`}>
          Sleek Studio
        </div>
        {/* <div className="font-light text-base md:text-2xl text-gray-700 py-4 max-w-xl text-center">
          Exquisite Indian formal and traditional party wear
        </div> */}
        
        {/* Buttons container - flex-col on mobile, flex-row on larger screens */}
        <div className="flex flex-col items-center md:flex-row gap-4 md:gap-6 mt-2">
          <Link href="/products">
            <button className="bg-black hover:bg-gray-800 transition-colors rounded-full w-fit text-white px-5 py-2 text-md">
              Explore Collection
            </button>
          </Link>
          <Link href="/contact">
            <button className="bg-transparent hover:bg-gray-100 transition-colors border-2 border-black rounded-full w-fit text-gray-900 px-5 py-2 text-md">
              Contact Us
            </button>
          </Link>
        </div>
      </motion.div>
    </AuroraBackground> 
  );
}