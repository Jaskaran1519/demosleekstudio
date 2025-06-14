"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

import { anotherStylishFont } from "@/app/fonts" // Assuming this path is correct
import {
  Carousel,
  CarouselContent,
  CarouselItem, // We'll use shadcn's CarouselItem
  type CarouselApi,
} from "@/components/ui/carousel" // UPDATE THIS PATH if your shadcn carousel is elsewhere

// Instagram-style post data
const posts = [
  { id: 1, username: "anamariaburs", image: "/instaposts/1.jpg", description: "Megan Sheep Jumper", postLink: "/products/megan-sheep-jumper" },
  { id: 2, username: "sophiestyles", image: "/instaposts/2.jpg", description: "Alpine Wool Cardigan", postLink: "/products/alpine-wool-cardigan" },
  { id: 3, username: "fashionforward", image: "/instaposts/3.jpg", description: "Nordic Pattern Sweater", postLink: "/products/nordic-pattern-sweater" },
  { id: 4, username: "winterwardrobe", image: "/instaposts/4.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
  { id: 5, username: "winterwardrobe", image: "/instaposts/5.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
  { id: 6, username: "winterwardrobe", image: "/instaposts/6.jpg", description: "Merino Blend Pullover", postLink: "/products/merino-blend-pullover" },
]

interface CarouselItemData {
  id: number
  username: string
  image: string
  description: string
  postLink: string
}

// Constants for styling the animation
const ACTIVE_SCALE = 1.0
const INACTIVE_SCALE = 0.75 // How small non-active items become
const ACTIVE_OPACITY = 1.0
const INACTIVE_OPACITY = 0.6 // How transparent non-active items become

// This component renders the actual content of each card
// It receives `isCenter` for potential optimizations like Next/Image priority
const AnimatedCarouselCardContent = ({
  itemData,
  isCenter,
}: {
  itemData: CarouselItemData
  isCenter: boolean
}) => {
  return (
    // Define the base dimensions of the card (when it's at full scale)
    <div
      className={`
        w-[280px] h-[380px] sm:w-[300px] sm:h-[400px] md:w-[350px] md:h-[500px] 
        rounded-lg overflow-hidden shadow-xl relative bg-neutral-200 dark:bg-neutral-800
      `}
    >
      <Link href={itemData.postLink} className="block h-full w-full">
        <Image
          src={itemData.image || "/placeholder.svg"} // Ensure placeholder exists if images might be missing
          alt={itemData.description}
          fill
          className="object-cover"
          priority={isCenter} // Load center image with higher priority
          sizes={
            isCenter
              ? "(max-width: 640px) 280px, (max-width: 768px) 300px, 350px" // Sizes for center image
              : "(max-width: 640px) 210px, (max-width: 768px) 225px, 262px" // Sizes for side images (scaled down)
          }
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-semibold truncate text-sm md:text-base">@{itemData.username}</p>
          <p className="text-white/80 text-xs md:text-sm truncate">{itemData.description}</p>
        </div>
      </Link>
    </div>
  )
}

export default function StylishFontPage() {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null)
  // `selectedIndex` stores the index of the slide that is currently "snapped" to the center.
  const [selectedIndex, setSelectedIndex] = useState(0)
  // `scrollProgress` stores the progress (0 to 1) of the current scroll animation towards the next snap point.
  const [scrollProgress, setScrollProgress] = useState(0)

  // Initialize selectedIndex and subscribe to Embla events when API is ready
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollProgress(0) // Reset progress when a new slide snaps
    }

    const onScroll = () => {
      setScrollProgress(emblaApi.scrollProgress())
    }
    
    // Set initial values
    onSelect(); 
    emblaApi.on("select", onSelect)
    emblaApi.on("scroll", onScroll)
    emblaApi.on("reInit", onSelect) // Handle re-initialization (e.g., on resize)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("scroll", onScroll)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  // Function to calculate dynamic style (scale, opacity, zIndex) for each item
  const getStyleForItem = useCallback(
    (index: number, totalItems: number) => {
      if (!emblaApi) { // Default styles before Embla is initialized
        const isCurrentlyCenter = index === 0; // Assume first item is center initially
        return {
          scale: isCurrentlyCenter ? ACTIVE_SCALE : INACTIVE_SCALE,
          opacity: isCurrentlyCenter ? ACTIVE_OPACITY : INACTIVE_OPACITY,
          isCenter: isCurrentlyCenter,
          zIndex: isCurrentlyCenter ? 20 : (Math.abs(index - 0) === 1 ? 10 : 0),
        };
      }

      let scale = INACTIVE_SCALE
      let opacity = INACTIVE_OPACITY
      let isCenter = false
      let z = 0 // Default z-index

      const currentSnap = selectedIndex // The slide that was last fully centered
      const progress = scrollProgress // How far we are into transitioning to the *next* slide
      
      // Item that was at center (currentSnap) and is now moving out (to the left)
      if (index === currentSnap) {
        scale = ACTIVE_SCALE - progress * (ACTIVE_SCALE - INACTIVE_SCALE)
        opacity = ACTIVE_OPACITY - progress * (ACTIVE_OPACITY - INACTIVE_OPACITY)
        isCenter = progress < 0.5 // It's "center" for priority loading if mostly still in center
        z = 20 // Highest z-index as it's the (departing) center
      }
      // Item that is to the right of currentSnap and is moving into the center
      else if (index === (currentSnap + 1 + totalItems) % totalItems) {
        scale = INACTIVE_SCALE + progress * (ACTIVE_SCALE - INACTIVE_SCALE)
        opacity = INACTIVE_OPACITY + progress * (ACTIVE_OPACITY - INACTIVE_OPACITY)
        isCenter = progress >= 0.5 // Becomes "center" for priority loading as it arrives
        z = 10 + progress * 10 // z-index increases as it moves to center
      }
      // Other items (further left or right)
      else {
        // Calculate their "static" distance from the snapped center item
        let diffFromSnap = index - currentSnap;
        if (diffFromSnap > totalItems / 2) diffFromSnap -= totalItems;
        if (diffFromSnap < -totalItems / 2) diffFromSnap += totalItems;

        if (Math.abs(diffFromSnap) === 1) { // Items immediately adjacent to the snapped item (but not in active transition)
            z = 5;
        } else { // Items further out
            scale = INACTIVE_SCALE * 0.9; // Make them even smaller/more transparent
            opacity = INACTIVE_OPACITY * 0.8;
            z = 1;
        }
      }
      
      // If an item IS the `selectedIndex` (fully snapped) and no scroll is happening (progress is 0),
      // ensure it has full active styles. This overrides the transitional styles if snapped.
      if (index === selectedIndex && progress === 0) {
          scale = ACTIVE_SCALE;
          opacity = ACTIVE_OPACITY;
          isCenter = true;
          z = 20;
      }


      return { scale, opacity, isCenter, zIndex: Math.round(z) }
    },
    [emblaApi, selectedIndex, scrollProgress]
  )

  return (
    <div className="relative w-full mx-auto py-12 px-4">
      <div className="relative">
        {/* Background Text Layer (Behind Carousel) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <h1
            className={`${anotherStylishFont.className} text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold text-center text-primary whitespace-nowrap`}
          >
            Sleek Studio
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <Carousel
            setApi={setEmblaApi}
            opts={{
              align: "center", // Critical for centering the active slide
              loop: true,
              slidesToScroll: 1,
            }}
            autoPlay={true}
            autoPlayInterval={4000} // Auto-play every 4 seconds
            className="py-12"
          >
            <CarouselContent className="-ml-4"> {/* Standard shadcn spacing, creates overlap */}
              {posts.map((post, index) => {
                const { scale, opacity, isCenter, zIndex } = getStyleForItem(
                  index,
                  posts.length
                )
                return (
                  <CarouselItem
                    key={post.id}
                    // Adjust basis to control how many items are roughly visible.
                    // e.g., basis-[calc(100%/2.5)] means ~2.5 items "fit" if equally sized.
                    // The `align:"center"` will ensure one is centered.
                    // `pl-4` is standard shadcn spacing for items.
                    className="pl-4 basis-[calc(100%/2.2)] sm:basis-[calc(100%/2.5)] md:basis-[calc(100%/2.8)] flex justify-center items-center"
                    style={{ zIndex }} // Apply z-index to the item container for stacking
                  >
                    {/* This inner div is what gets scaled and its opacity changed.
                        The transformOrigin ensures scaling happens from the center. */}
                    <div
                      style={{
                        transform: `scale(${scale})`,
                        opacity: opacity,
                        transformOrigin: 'center center',
                      }}
                      // No CSS transitions here; styles are applied directly by React based on scroll progress.
                      // This ensures the animation is perfectly synced with the scroll.
                    >
                      <AnimatedCarouselCardContent
                        itemData={post}
                        isCenter={isCenter}
                      />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            {/* CarouselPrevious and CarouselNext are omitted as per request */}
          </Carousel>
        </div>

        {/* Foreground Text Layer (Overlay on Carousel) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1
            className={`${anotherStylishFont.className} text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold text-center text-primary/30 whitespace-nowrap`}
          >
            Sleek Studio
          </h1>
        </div>
      </div>

      {/* Caption Below Carousel */}
      <div className="text-center mt-8"> {/* Increased margin-top for better spacing */}
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Our Happy Customers
        </p>
      </div>
    </div>
  )
}