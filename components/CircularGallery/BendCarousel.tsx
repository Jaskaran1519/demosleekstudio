'use client'
import { magerFont } from '@/app/fonts'
import CircularGallery from './CircularGallery'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export const BendCarousel = () => {
    const [bend, setBend] = useState(3)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setBend(0) // No bend on small screens
            } else if (window.innerWidth < 1024) {
                setBend(1.5) // Medium bend on medium screens
            } else {
                setBend(4) // Full bend on large screens
            }
        }

        // Set initial value
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Clean up
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className='relative'>
            <div className='relative'>
                <CircularGallery bend={bend} textColor="#ffffff" borderRadius={0.05} />
            </div>
            <div className={`${magerFont.className} text-black relative mt-8 pb-5 md:pb-10 xl:pb-16 text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold w-full`}>
            <div className='text-primary flex items-center justify-center gap-2 mt-2'>
                    <span>We dont just stitch clothes</span>
                </div>
                <div className='text-primary flex items-center justify-center gap-2 mt-2'>
                    <span>We stitch Experiences</span>
                    <Image src="/extraimages/leaf.svg" alt="leaf" width={40} height={40} className='w-8 h-8 md:w-10 md:h-10' />
                </div>
            </div>
        </div>
    )
}

export default BendCarousel