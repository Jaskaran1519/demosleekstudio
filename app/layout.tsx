import type { Metadata } from "next";
import {  Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import Navbar from "@/components/Header/Navbar";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import SmoothScroll from "@/lib/SmoothScroll";
import Footer from "@/components/Others/Fotoer";
import localFont from 'next/font/local';
import ClientSplashScreen from '@/components/ClientSplashScreen'
import { mainFont } from "./fonts";

// Load the font
const magerFont = localFont({
  src: './fonts/meleah.woff2',
  display: 'swap',
  variable: '--font-mager', // Optional: for CSS variable usage
})
const geistSans = Geist({
  weight: "400",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Sleek Studio",
  description: "Your only fashion destination",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>   
      <body
        className={`${geistSans.className} antialiased mx-auto  `}
        >
          <SmoothScroll>
          <ClientSplashScreen>
              <ScrollProgress className="top-0" />
              <Navbar/>
              <div className="min-h-screen">
              {children}
              </div>
              <Footer/>
          </ClientSplashScreen>
          </SmoothScroll>
      </body>
        </AuthProvider>
    </html>
  );
}
