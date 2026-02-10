"use client"

import React, { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { canelaFont } from "@/app/fonts"

/* ─── Volume Icons ─── */
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

/* ─── Fade-in wrapper ─── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Video Hero ─── */
function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <video
        ref={videoRef}
        src="/ss-video.webm"
        loop
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Gradient overlay at bottom for readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 bg-white/15 backdrop-blur-sm rounded-full p-3 hover:bg-white/25 transition-all duration-300 focus:outline-none"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeOffIcon className="w-6 h-6 text-white" />
        ) : (
          <VolumeUpIcon className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}

/* ─── Section Divider ─── */
function Divider() {
  return (
    <div className="flex items-center justify-center my-16 md:my-24">
      <div className="w-16 h-px bg-gray-300" />
      <div className="mx-4 w-1.5 h-1.5 rounded-full bg-gray-400" />
      <div className="w-16 h-px bg-gray-300" />
    </div>
  )
}

/* ─── Main Component ─── */
export default function TimelineHistory() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Video ── */}
      <VideoHero />

      {/* ── Opening Quote ── */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-8 md:pt-32 md:pb-12 text-center">
        <FadeIn>
          <p
            className={`${canelaFont.className} text-2xl md:text-4xl leading-relaxed text-gray-900 tracking-wide`}
          >
            &ldquo;Some brands are built with money.
            <br />
            Ours was built with time, hard work,
            <br className="hidden md:inline" /> and family values.&rdquo;
          </p>
        </FadeIn>
      </div>

      <Divider />

      {/* ── 1947 ── */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <FadeIn>
          <span className="inline-block text-sm font-medium tracking-[0.25em] uppercase text-gray-400 mb-4">
            1947
          </span>
          <h2
            className={`${canelaFont.className} text-3xl md:text-4xl text-gray-900 mb-6 leading-snug`}
          >
            The Beginning
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Our story began in 1947, when{" "}
            <span className="text-gray-900 font-medium">
              Sardar Jaimal Singh Ji
            </span>{" "}
            came to Hoshiarpur during the time of Partition. With very little but
            strong faith and determination, he opened a small depot to support
            his family. That small beginning became the base of a journey that
            continues even today.
          </p>
        </FadeIn>
      </section>

      <Divider />

      {/* ── 1989 ── */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <FadeIn>
          <span className="inline-block text-sm font-medium tracking-[0.25em] uppercase text-gray-400 mb-4">
            1989
          </span>
          <h2
            className={`${canelaFont.className} text-3xl md:text-4xl text-gray-900 mb-6 leading-snug`}
          >
            Aay Ess Suitings
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            His legacy was taken forward by{" "}
            <span className="text-gray-900 font-medium">
              Sardar Gurmeet Singh Ji
            </span>{" "}
            and his brothers, who started Aay Ess Suitings. With honest work,
            quality tailoring, and dedication, the name slowly earned trust and
            respect in the region.
          </p>
        </FadeIn>
      </section>

      <Divider />

      {/* ── 2013 ── */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <FadeIn>
          <span className="inline-block text-sm font-medium tracking-[0.25em] uppercase text-gray-400 mb-4">
            2013
          </span>
          <h2
            className={`${canelaFont.className} text-3xl md:text-4xl text-gray-900 mb-6 leading-snug`}
          >
            Sleek Studio
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            The next generation&mdash;
            <span className="text-gray-900 font-medium">
              Sardar Kulbir Singh
            </span>{" "}
            and{" "}
            <span className="text-gray-900 font-medium">
              Sardar Arvinderpal Singh
            </span>
            &mdash;founded Sleek Studio. It was created not just as a business,
            but as a way to carry forward the family&rsquo;s values while
            bringing modern design and a fresh approach to custom tailoring.
          </p>
        </FadeIn>
      </section>

      <Divider />

      {/* ── Today ── */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <FadeIn>
          <span className="inline-block text-sm font-medium tracking-[0.25em] uppercase text-gray-400 mb-4">
            Today
          </span>
          <h2
            className={`${canelaFont.className} text-3xl md:text-4xl text-gray-900 mb-6 leading-snug`}
          >
            Our Promise
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
            Located in Hoshiarpur, Punjab, Sleek Studio specializes in
            made-to-measure bridal wear and men&rsquo;s formal clothing. Every
            outfit is carefully designed, stitched, and finished with attention
            to fit, comfort, and detail.
          </p>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            For us, customers are not just buyers. We take time to understand
            their needs, their occasions, and their personal style. From the
            first meeting to the final fitting, each garment is made with care
            and respect.
          </p>
        </FadeIn>
      </section>

      <Divider />

      {/* ── Closing Statement ── */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-24 md:pb-32 text-center">
        <FadeIn>
          <p
            className={`${canelaFont.className} text-xl md:text-3xl text-gray-900 leading-relaxed tracking-wide`}
          >
            Sleek Studio is not only about clothing.
          </p>
          <p className="text-gray-500 text-lg md:text-xl mt-6 leading-relaxed max-w-xl mx-auto">
            It is about trust built over generations, relationships formed over
            time, and quality that speaks for itself.
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
