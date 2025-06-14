"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

import { anotherStylishFont } from "@/app/fonts"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel" // UPDATE THIS PATH if needed

// Instagram-style post data
const posts = [
  { id: 1, username: "anamariaburs", image: "/instaposts/1.jpg", description: "Megan Sheep Jumper", postLink: "/products/megan-sheep-jumper" },
  { id: 2, username: "sophiestyles", image: "/instaposts/2.jpg", description: "Alpine Wool Cardigan", postLink: "/products/alpine-wool-cardigan" },
  { id: 3, username: "fashionforward", image: "/instaposts/3.jpg", description: "Nordic Pattern Sweater", postLink: "/products/nordic-pattern-sweater" },
  { id: 4, username: "winterwardrobe", image: "/instaposts/4.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
  { id: 5, username: "winterwardrobe", image: "/instaposts/5.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
  { id: 6, username: "winterwardrobe", image: "/instaposts/6.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
];

interface CarouselItemData {
  id: number
  username: string
  image: string
  description: string
  postLink: string
}

// Constants for styling the animation
const ACTIVE_SCALE = 1.0;
const INACTIVE_SCALE = 0.75;
const ACTIVE_OPACITY = 1.0;
const INACTIVE_OPACITY = 0.6;

const AnimatedCarouselCardContent = ({
  itemData,
  isCenter,
}: {
  itemData: CarouselItemData
  isCenter: boolean
}) => {
  return (
    <div
      className={`
        w-[280px] h-[380px] sm:w-[300px] sm:h-[400px] md:w-[350px] md:h-[500px] 
        rounded-lg overflow-hidden shadow-xl relative bg-neutral-200 dark:bg-neutral-800
      `}
    >
      <Link href={itemData.postLink} className="block h-full w-full">
        <Image
          src={itemData.image || "/placeholder.svg"}
          alt={itemData.description}
          fill
          className="object-cover"
          priority={isCenter}
          sizes={
            isCenter
              ? "(max-width: 640px) 280px, (max-width: 768px) 300px, 350px"
              : "(max-width: 640px) 210px, (max-width: 768px) 225px, 262px"
          }
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-semibold truncate text-sm md:text-base">@{itemData.username}</p>
          <p className="text-white/80 text-xs md:text-sm truncate">{itemData.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default function StylishFontPage() {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const totalItems = posts.length; // Get total items count

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollProgress(0); 
    };

    const onScroll = () => {
      setScrollProgress(emblaApi.scrollProgress());
    };
    
    onSelect(); 
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const getStyleForItem = useCallback(
    (itemIndexInArray: number) => {
      if (!emblaApi || totalItems < 1) {
        const isFirst = itemIndexInArray === 0;
        return {
          scale: isFirst ? ACTIVE_SCALE : INACTIVE_SCALE,
          opacity: isFirst ? ACTIVE_OPACITY : INACTIVE_OPACITY,
          isCenter: isFirst,
          zIndex: isFirst ? 20 : 5,
        };
      }

      const currentSnappedIndex = selectedIndex;
      const progressDecimal = scrollProgress;

      // Only one item should be the center at any time
      const isCurrentCenter = itemIndexInArray === currentSnappedIndex;
      const isNextCenter = itemIndexInArray === ((currentSnappedIndex + 1) % totalItems);
      const isPrevCenter = itemIndexInArray === ((currentSnappedIndex - 1 + totalItems) % totalItems);
      
      // Default values - all items start small
      let itemScale = INACTIVE_SCALE;
      let itemOpacity = INACTIVE_OPACITY;
      let itemIsCenterForImgPriority = false;
      let itemZIndex = 5;

      // Only the center item should be large
      if (isCurrentCenter) {
        itemScale = ACTIVE_SCALE;
        itemOpacity = ACTIVE_OPACITY;
        itemIsCenterForImgPriority = true;
        itemZIndex = 20;
      } else if (isNextCenter || isPrevCenter) {
        // Immediate neighbors stay small but with full opacity
        itemScale = INACTIVE_SCALE;
        itemOpacity = ACTIVE_OPACITY;
        itemZIndex = 10;
      }
      
      // When not scrolling, ensure only the center item is active
      if (progressDecimal === 0) {
        itemIsCenterForImgPriority = isCurrentCenter;
        itemScale = isCurrentCenter ? ACTIVE_SCALE : INACTIVE_SCALE;
        itemOpacity = isCurrentCenter ? ACTIVE_OPACITY : INACTIVE_OPACITY;
        itemZIndex = isCurrentCenter ? 20 : 5;
      }
      
      // Debug logging (uncomment if needed)
      // console.log({
      //   item: itemIndexInArray,
      //   isCurrentCenter,
      //   isNextCenter,
      //   isPrevCenter,
      //   scale: itemScale,
      //   zIndex: itemZIndex
      // });

      return {
        scale: itemScale,
        opacity: itemOpacity,
        isCenter: itemIsCenterForImgPriority,
        zIndex: Math.round(itemZIndex),
      };
    },
    [emblaApi, selectedIndex, scrollProgress, totalItems] // totalItems is now a stable const from posts.length
  );

  return (
    <div className="relative w-full mx-auto py-12 px-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <h1
            className={`${anotherStylishFont.className} text-7xl sm:text-9xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] font-bold text-center text-primary whitespace-nowrap`}
          >
            Sleek Studio
          </h1>
        </div>

        {/* Mobile Carousel (single item) */}
        <div className="md:hidden relative z-10 w-full max-w-md mx-auto">
          <Carousel
            setApi={setEmblaApi}
            opts={{
              loop: true,
              slidesToScroll: 1,
              duration: 30,
            }}
            autoPlay={true}
            autoPlayInterval={4000}
            className="py-8"
          >
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem key={post.id} className="flex justify-center">
                  <AnimatedCarouselCardContent
                    itemData={post}
                    isCenter={true}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop Carousel (multiple items) */}
        <div className="hidden md:block relative z-10 w-full max-w-6xl mx-auto">
          <Carousel
            setApi={setEmblaApi}
            opts={{
              align: "center",
              loop: true,
              slidesToScroll: 1,
              duration: 30,
            }}
            autoPlay={true}
            autoPlayInterval={4000}
            className="py-12"
          >
            <CarouselContent className="-ml-4">
              {posts.map((post, index) => {
                const { scale, opacity, isCenter, zIndex } = getStyleForItem(index);
                return (
                  <CarouselItem
                    key={post.id}
                    className="pl-4 basis-[calc(100%/2.2)] sm:basis-[calc(100%/2.5)] md:basis-[calc(100%/2.8)] flex justify-center items-center"
                    style={{ zIndex }}
                  >
                    <div
                      style={{
                        transform: `scale(${scale})`,
                        opacity: opacity,
                        transformOrigin: 'center center',
                      }}
                    >
                      <AnimatedCarouselCardContent
                        itemData={post}
                        isCenter={isCenter}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1
            className={`${anotherStylishFont.className} text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] font-bold text-center text-primary/30 whitespace-nowrap`}
          >
            Sleek Studio
          </h1>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Our Happy Customers
        </p>
      </div>
    </div>
  );
}