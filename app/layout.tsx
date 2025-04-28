import type { Metadata } from "next";
import {  Arimo, Crimson_Text, Dosis, EB_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import Navbar from "@/components/Header/Navbar";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import SmoothScroll from "@/lib/SmoothScroll";
import Footer from "@/components/Others/Fotoer";

const geistSans = Crimson_Text({
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
        className={`${geistSans.className} antialiased mx-auto `}
        >
          <SmoothScroll>
           <ScrollProgress className="top-0" />
           <Navbar/>
           {children}
           <Footer/>
          </SmoothScroll>
      </body>
        </AuthProvider>
    </html>
  );
}
