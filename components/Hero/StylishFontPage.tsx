"use client";

import { Carousel } from "@/components/aceternity/carousel";
import { magerFont } from "@/app/fonts";

export default function StylishFontPage() {
  const slideData = [
    {
      src: "/collabs/1.webp",
      instagramUrl: "https://www.instagram.com/p/DKuP2daJI46/?igsh=ZjAxdXU0NmJ1aTN0",
      title: "Collaboration 1",
      button: "View Post"
    },
    {
      src: "/collabs/2.webp",
      instagramUrl: "https://www.instagram.com/p/DJBY-YUxxkX/?igsh=MTdjaDdpMjd2cTZhdw==",
      title: "Collaboration 2",
      button: "View Post"
    },
    {
      src: "/collabs/3.webp",
      instagramUrl: "https://www.instagram.com/p/DIOH5GlSy6R/?igsh=cGh0a3htZjEyNHJw",
      title: "Collaboration 3",
      button: "View Post"
    },
    {
      src: "/collabs/4.webp",
      instagramUrl: "https://www.instagram.com/p/DCEjyTsy4AM/?igsh=ZDZzMWhyNGY0NHhn",
      title: "Collaboration 4",
      button: "View Post"
    },
    {
      src: "/collabs/5.webp",
      instagramUrl: "https://www.instagram.com/p/DF-FVQYSMbp/?img_index=2&igsh=dGlrcGFlejZuMWE1",
      title: "Collaboration 5",
      button: "View Post"
    },
    {
      src: "/collabs/6.webp",
      instagramUrl: "https://www.instagram.com/p/DF4ZR3-R3xC/?igsh=czRsOXdnaHYyZnd2",
      title: "Collaboration 6",
      button: "View Post"
    },
    {
      src: "/collabs/7.webp",
      instagramUrl: "https://www.instagram.com/p/DDKB3f4Sl4s/?igsh=MTZ2c2tuZ2g1dG1naQ==",
      title: "Collaboration 7",
      button: "View Post"
    },
  ];

  return (
    <div className="relative overflow-hidden w-full h-auto py-20">
      <div className="relative z-10 px-4">
        <h2 className={`${magerFont.className} font-semibold text-3xl md:text-4xl lg:text-5xl text-center mb-8 md:mb-12 text-neutral-900 `}>
          Our Happy Customers
        </h2>
        <Carousel slides={slideData} />
      </div>
    </div>
  );
}
