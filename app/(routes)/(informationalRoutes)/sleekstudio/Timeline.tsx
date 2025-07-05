"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { magerFont } from "@/app/fonts"

interface TimelineStage {
  year: string
  title: string
  description: string
  image?: string
  isStart?: boolean
}

const timelineData: TimelineStage[] = [
  {
    year: "1989",
    title: "Started ‘Aay Ess Suitings’",
    description: "Just a couple of years before the country set on its course towards economic liberalization, we set foot to change the paradigm of the then-fragmented Indian textile market.",
    image: "/history/1989.jpg",
  },
  {
    year: "2000",
    title: "Founded ‘Sleek’",
    description: "Embracing the tech revolution that took place in the early 2000s, we registered Sleek to set on a course to democratize India’s occasion-wear industry.",
    image: "/history/2000.jpg",
  },
  {
    year: "2008",
    title: "Expanded operations under sleek to 100 stores.",
    description: "While the market was in a state of recession in 2008, Sleek remained indifferent and was on an expansion spree with operations & project deliveries across PAN-India.",
    image: "/history/2008.jpg",
  },
  {
    year: "2013",
    title: "Ventured as Sleek Studio",
    description: "With the fast-changing landscape of the Indian couture industry, Sleek was registered as Sleek Studio with the intent to appeal to the contemporary audience with modern embellishments.",
    image: "/history/2013.jpg",
  },
  {
    year: "2021",
    title: "Launched thesleekstudio.com",
    description: "Keeping our momentum of tailored texture designs intact and setting a foot in the surging Indian eCommerce, we are giving the surefooted off-the-rack millennials of today the required dapper feel through our couture exuding valor, pride, and discipline.",
    image: "/history/2021.jpg",
  },
]

function VolumeUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

function VolumeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 4L2.99 5.27 7 9.27v2.46h2.18l2.28 2.28-1.27 1.27L7 14.73v2.46l5-5h2.73l4.5 4.5 1.27-1.27L5.27 4 4.27 4zM12 8.27L9.27 11 12 13.73V8.27z" />
    </svg>
  )
}

function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false) // Start unmuted by default

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Try to play the video when component mounts
      const playPromise = video.play()
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Autoplay failed:', error)
        })
      }
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black mb-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src="/ss-video.webm"
          loop
          autoPlay
          playsInline
          className="h-full w-full object-cover md:w-auto md:max-w-none"
        />
      </div>
      
      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60 transition-all duration-300 focus:outline-none pointer-events-auto"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeOffIcon className="w-8 h-8 text-white" />
        ) : (
          <VolumeUpIcon className="w-8 h-8 text-white" />
        )}
      </button>
    </div>
  )
}

export default function TimelineHistory() {
  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <VideoHero />

      <div className="text-center my-16">
        <h2 className={`${magerFont.className} text-5xl md:text-6xl text-gray-900 tracking-wider`}>
          Our Journey
        </h2>
      </div>

      {/* Timeline Section */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 w-1 bg-gray-200 h-full transform -translate-x-1/2" />

        {timelineData.map((stage, index) => (
          <TimelineItem
            key={index}
            stage={stage}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>

      {/* Final Message */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto px-4 mt-32 text-center"
      >
        <h2 className="text-2xl md:text-4xl font-light text-gray-900 mb-8 tracking-wider">
          --JOURNEY NEVER STOP--
        </h2>
      </motion.div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 border border-gray-200 rounded-full opacity-30" />
        <div className="absolute bottom-40 left-10 w-48 h-48 border border-gray-200 rounded-full opacity-20" />
        <div className="absolute top-1/2 right-20 w-24 h-24 border border-gray-200 rounded-full opacity-25" />
      </div>
    </div>
  )
}

function TimelineItem({
  stage,
  index,
  isLeft,
}: {
  stage: TimelineStage
  index: number
  isLeft: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex items-center ${isLeft ? "md:justify-start" : "md:justify-end"}`}
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
        className="absolute left-4 md:left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-2 md:-translate-x-2 z-10 border-4 border-white shadow-lg"
      />

      {/* Content Container */}
      <div
        className={`w-full md:w-1/2 ${
          // On mobile, always position content to the right of the line
          "ml-12 md:ml-0 " +
          (isLeft ? "md:w-1/2 md:pr-12 md:text-right" : "md:w-1/2 md:pl-12 md:text-left md:ml-auto")
        }`}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          {stage.year && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              className="text-sm text-gray-500 mb-2 tracking-wider"
            >
              {stage.year}
            </motion.div>
          )}

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
            className={`text-xl md:text-2xl font-light text-gray-900 mb-4 tracking-wide ${
              stage.isStart ? "text-center text-2xl md:text-3xl" : ""
            }`}
          >
            {stage.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            className="text-gray-600 leading-relaxed mb-6"
          >
            {stage.description}
          </motion.p>

          {stage.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.35 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src={stage.image || "/placeholder.svg"}
                alt={stage.title}
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

