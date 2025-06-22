'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';

const defaultItems = [
  { image: `/introimages/1.jpg`, text: "Bridge" },
  { image: `/introimages/2.jpg`, text: "Desk Setup" },
  { image: `/introimages/3.jpg`, text: "Waterfall" },
  { image: `/introimages/4.jpg`, text: "Strawberries" },
  { image: `/introimages/5.jpg`, text: "Deep Diving" },
  { image: `/introimages/6.jpg`, text: "Train Track" },
  { image: `/introimages/1.jpg`, text: "Santorini" },
  { image: `/introimages/2.jpg`, text: "Blurry Lights" },
  { image: `/introimages/3.jpg`, text: "New York" },
  { image: `/introimages/4.jpg`, text: "Good Boy" },
  { image: `/introimages/5.jpg`, text: "Coastline" },
  { image: `/introimages/6.jpg`, text: "Palm Trees" },
];

interface GalleryItemProps {
  image: string;
  text: string;
}

interface CircularGalleryProps {
  items?: GalleryItemProps[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
}

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

export default function CircularGallery({ items, bend, textColor, borderRadius }: CircularGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [maxScroll, setMaxScroll] = useState(0);

  const x = useMotionValue(0);
  const springX = useSpring(x, {
    stiffness: 400,
    damping: 90,
  });

  const parallaxX = useTransform(scrollYProgress, [0, 1], [0, maxScroll]);

  const manualOffset = useRef(0);
  const isManuallyScrolling = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const galleryItems = items && items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const calculateMaxScroll = () => {
      if (galleryRef.current) {
        const newMaxScroll = galleryRef.current.scrollWidth - galleryRef.current.clientWidth;
        setMaxScroll(newMaxScroll);
      }
    };
    calculateMaxScroll();
    window.addEventListener('resize', calculateMaxScroll);
    return () => window.removeEventListener('resize', calculateMaxScroll);
  }, [galleryItems]);

  useEffect(() => {
    const unsubscribeParallax = parallaxX.onChange((latest) => {
      if (!isManuallyScrolling.current) {
        x.set(latest + manualOffset.current);
      }
    });

    const unsubscribeSpring = springX.onChange((latest) => {
      if (galleryRef.current) {
        galleryRef.current.scrollLeft = latest;
      }
    });

    return () => {
      unsubscribeParallax();
      unsubscribeSpring();
    };
  }, [parallaxX, springX, x]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let dragStartX = 0;
    let scrollStartX = 0;

    const startManualScroll = () => {
        isManuallyScrolling.current = true;
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
    }

    const endManualScroll = () => {
        debounceTimer.current = setTimeout(() => {
            if (isManuallyScrolling.current) {
                manualOffset.current = x.get() - parallaxX.get();
                isManuallyScrolling.current = false;
            }
        }, 200);
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      startManualScroll();
      const newScrollX = x.get() + e.deltaY * 0.5;
      const clampedX = Math.max(0, Math.min(newScrollX, maxScroll));
      x.set(clampedX);
      endManualScroll();
    };

    const handleMouseDown = (e: MouseEvent) => {
      startManualScroll();
      dragStartX = e.pageX - gallery.offsetLeft;
      scrollStartX = x.get();
      gallery.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isManuallyScrolling.current || dragStartX === 0) return;
      e.preventDefault();
      const currentX = e.pageX - gallery.offsetLeft;
      const walk = (currentX - dragStartX) * 2;
      const newScrollX = scrollStartX - walk;
      const clampedX = Math.max(0, Math.min(newScrollX, maxScroll));
      x.set(clampedX);
    };

    const handleMouseUpOrLeave = () => {
      if (!isManuallyScrolling.current) return;
      dragStartX = 0;
      gallery.style.cursor = 'grab';
      endManualScroll();
    };

    gallery.addEventListener('wheel', handleWheel, { passive: false });
    gallery.addEventListener('mousedown', handleMouseDown);
    gallery.addEventListener('mousemove', handleMouseMove);
    gallery.addEventListener('mouseup', handleMouseUpOrLeave);
    gallery.addEventListener('mouseleave',handleMouseUpOrLeave);

    return () => {
      gallery.removeEventListener('wheel', handleWheel);
      gallery.removeEventListener('mousedown', handleMouseDown);
      gallery.removeEventListener('mousemove', handleMouseMove);
      gallery.removeEventListener('mouseup', handleMouseUpOrLeave);
      gallery.removeEventListener('mouseleave', handleMouseUpOrLeave);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [maxScroll, parallaxX, x]);

  return (
    <div
      ref={galleryRef}
      className="gallery-container w-full h-full flex overflow-x-hidden cursor-grab select-none pt-8"
    >
      <style>{`
        .gallery-container::-webkit-scrollbar {
          display: none;
        }
        .gallery-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {galleryItems.map((item, index) => (
        <div key={index} className="flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[28%] p-4">
          <div className="w-full">
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={item.image}
                alt={item.text}
                fill
                className="pointer-events-none object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
