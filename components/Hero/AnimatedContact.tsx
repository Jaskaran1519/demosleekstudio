"use client"

import { useEffect } from "react"
// Assuming motion/react is correctly aliased or installed
import { motion, stagger, useAnimate } from "framer-motion" // Correct import for motion

import Floating, {
  FloatingElement,
} from "@/fancy/components/image/parallax-floating"

// Assuming this path is correct
import { exampleImages } from "../../utils/demo-images"
import Link from "next/link"

const AnimatedContact = () => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    // Ensure animate function is called correctly
    // Note: useAnimate with Framer Motion v11+ might have slightly different API
    // If using older framer-motion, this might be okay.
    // For newer versions, you might target elements differently.
    // Let's assume this syntax works with your version.
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    )
  }, [animate]) // Add animate to dependency array

  return (
    <div
      className="flex w-dvw h-dvh justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="text-5xl md:text-7xl z-50 text-white font-calendas italic">
          Sleek Studio
        </p>
        <Link  href="/contact">
        <button className="text-s z-50 py-2 px-4 hover:scale-110 transition-transform bg-white text-black rounded-full  cursor-pointer text-center"> {/* Added text-center */}
          Get in Touch
        </button>
        </Link>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        {/* ----- Image Positions Adjusted +5% to the left ----- */}

        <FloatingElement depth={0.5} className="top-[8%] left-[16%]"> {/* Was left-[11%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            alt="" // Added alt attribute
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[37%]"> {/* Was left-[32%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            alt="" // Added alt attribute
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[58%]"> {/* Was left-[53%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            alt="" // Added alt attribute
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[88%]"> {/* Was left-[83%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            alt="" // Added alt attribute
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[7%]"> {/* Was left-[2%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            alt="" // Added alt attribute
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[82%]"> {/* Was left-[77%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            alt="" // Added alt attribute
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[20%]"> {/* Was left-[15%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            alt="" // Added alt attribute
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[55%]"> {/* Was left-[50%] */}
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            alt="" // Added alt attribute
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export default AnimatedContact