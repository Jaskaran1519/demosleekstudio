"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import CircularText from "@/components/CircularText/CircularText"
import FadeIn from "@/components/FadeIn"

interface SectionData {
  id: string
  title: string
  description: string
  images: string[]
}

const sectionsData: SectionData[] = [
  {
    id: "groom",
    title: "Groom",
    description:
      "Discover our exclusive collection for the groom. From elegant suits to traditional wear, find the perfect outfit for your special day. Our carefully curated selection ensures you look your absolute best.",
    images: [
      "/services/groom1.webp",
      "/services/groom2.webp",
      "/services/groom3.webp",
    ],
  },
  {
    id: "bride",
    title: "Bride",
    description:
      "Explore our stunning bridal collection featuring exquisite dresses, jewelry, and accessories. Each piece is designed to make your wedding day unforgettable with timeless elegance and modern sophistication.",
    images: [
      "/services/bride1.webp",
      "/services/bride2.webp",
      "/services/bride3.webp",
    ],
  },
  {
    id: "family",
    title: "Family",
    description:
      "Complete your wedding celebration with our family collection. Find coordinated outfits for parents, siblings, and extended family members to create beautiful, harmonious wedding photos.",
    images: [
      "/services/family1.webp",
      "/services/family2.webp",
      "/services/family3.webp",
    ],
  },
]

export default function EcommerceSection() {
  const [activeTab, setActiveTab] = useState("groom")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  // Update animation key when tab changes to force re-animation
  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId)
      setActiveImageIndex(0)
      setAnimationKey(prev => prev + 1)
    }
  }

  const currentSection = sectionsData.find((section) => section.id === activeTab) || sectionsData[0]



  return (
    <div className="w-full py-12 mt-5 lg:py-24" style={{ backgroundColor: "#476f66" }}>
      <div className="container mx-auto px-4 lg:px-8 xl:px-16">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 lg:mb-16">
          {sectionsData.map((section) => (
            <button
              key={section.id}
              onClick={() => handleTabChange(section.id)}
              className={`px-1 py-2 font-medium text-lg md:text-xl transition-all duration-300 relative ${
                activeTab === section.id
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {section.title}
              {activeTab === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Active Image - First on mobile, left on desktop */}
          <div className="order-1 lg:order-1">
            <FadeIn animationKey={`${activeTab}-image-${activeImageIndex}-${animationKey}`} className="aspect-square rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <Image
                src={currentSection.images[activeImageIndex] || "/placeholder.svg"}
                alt={`${currentSection.title} - Image ${activeImageIndex + 1}`}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </FadeIn>
          </div>

          {/* Right Side Content - Reordered for mobile */}
          <div className="order-3 lg:order-2 flex flex-col h-full">
            {/* Thumbnail Images - Second on mobile, bottom on desktop */}
            <div className="order-1 lg:order-3 mb-6 lg:mb-0 lg:mt-auto lg:pt-6">
              <div className="grid grid-cols-3 gap-8">
                {currentSection.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      activeImageIndex === index
                        ? "ring-4 ring-white/50 scale-105"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${currentSection.title} - Thumbnail ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Section - Third on mobile, top on desktop */}
            <div className="order-2 lg:order-1 mt-6 lg:mt-0">
              <div className="relative">
                <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
                  {/* Content Section */}
                  <div className="space-y-6 flex-1">
                    <div className="space-y-8">
                      <FadeIn animationKey={`${activeTab}-title-${animationKey}`} className="flex items-center gap-2">
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">{currentSection.title}</h2>
                        <Image src="/extraimages/leaf.svg" alt="Leaf" width={24} height={24} className="w-6 h-6" />
                      </FadeIn>
                      <FadeIn animationKey={`${activeTab}-desc-${animationKey}`} className="bg-white/10 backdrop-blur-sm rounded-lg p-6" delay={100}>
                        <p className="text-white/90 leading-relaxed text-md lg:text-lg xl:text-xl">{currentSection.description}</p>
                      </FadeIn>
                    </div>

                    {/* Contact Us Button */}
                    <div className="mt-4">
                      <button 
                        onClick={() => window.location.href = '/contact'}
                        className="px-8 py-3 bg-white text-[#476f66] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                  
                  {/* Circular Text with Logo - Only visible on large screens */}
                  <div className="hidden lg:flex items-center justify-center relative w-56 h-56 group">
                    <div className="absolute inset-0 overflow-hidden">
                      <CircularText
                        text="SLEEK*STUDIO*CLOTHING*"
                        onHover="speedUp"
                        spinDuration={20}
                        className="w-full h-full group-hover:animate-spin-slow text-[#dab28a]"
                      />
                    </div>
                    <div className="relative z-10 w-20 h-20 -mt-5">
                      <Image 
                        src="/logo.svg" 
                        alt="Sleek Studio Logo" 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
