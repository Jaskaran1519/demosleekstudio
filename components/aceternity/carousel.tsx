"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useId, useEffect } from "react";

// Interfaces
interface SlideData {
  title: string;
  button: string;
  src: string;
  instagramUrl: string;
}

interface SlideProps {
  slide: SlideData;
  style: React.CSSProperties;
  isCenter: boolean;
}

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

interface CarouselProps {
  slides: SlideData[];
}

// Slide Component
const Slide = ({ slide, style, isCenter }: SlideProps) => {
  const { src, instagramUrl } = slide;

  return (
    <div
      className="absolute w-full h-full transition-all duration-500 ease-in-out"
      style={style}
    >
      <div className="relative w-full h-0 pb-[125%] bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
            alt=""
            src={src}
          />
          {isCenter && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group inline-block"
              >
                <span className="text-white text-base md:text-lg font-medium tracking-wider cursor-pointer">
                  View
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></span>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CarouselControl Component
const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 rounded-full focus:outline-none hover:bg-neutral-300 dark:hover:bg-neutral-700 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

// Carousel Component
export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const id = useId();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => setIsDesktop(mediaQuery.matches);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePreviousClick = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const getSlideStyle = (index: number): React.CSSProperties => {
    const totalSlides = slides.length;
    const offset = (index - current + totalSlides) % totalSlides;
    const isCenter = offset === 0;
    const isLeft = offset === totalSlides - 1;
    const isRight = offset === 1;

    let transform = "scale(0.7)";
    let opacity = 0;
    let zIndex = 1;

    if (isDesktop) {
      if (isCenter) {
        transform = "translateX(0%) scale(1)";
        opacity = 1;
        zIndex = 3;
      } else if (isRight) {
        transform = "translateX(80%) scale(0.8)";
        opacity = 0.5;
        zIndex = 2;
      } else if (isLeft) {
        transform = "translateX(-80%) scale(0.8)";
        opacity = 0.5;
        zIndex = 2;
      } else if (offset > 1 && offset < totalSlides / 2) {
        transform = "translateX(100%) scale(0.7)";
      } else {
        transform = "translateX(-100%) scale(0.7)";
      }
    } else { // Mobile view
      if (isCenter) {
        transform = "translateX(0) scale(1)";
        opacity = 1;
        zIndex = 2;
      } else if (isRight) {
        transform = `translateX(100%) scale(0.8)`;
      } else if (isLeft) {
        transform = `translateX(-100%) scale(0.8)`;
      } else {
        // Hide other slides
        transform = `translateX(${offset > totalSlides / 2 ? '-200' : '200'}%) scale(0.8)`;
      }
    }

    return {
      transform,
      opacity,
      zIndex,
      position: "absolute",
      width: "100%",
      height: "100%",
    };
  };

  return (
    <div
      className="relative w-full"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <div className="relative w-full md:w-[80vw] lg:w-[60vw] max-w-4xl mx-auto flex items-center justify-center">
        <div className="relative w-[80%] md:w-[50%] aspect-[4/5] max-h-[80vh]">
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              style={getSlideStyle(index)}
              isCenter={index === current}
            />
          ))}
        </div>
      </div>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
