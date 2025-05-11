import { Asul, Belleza, Great_Vibes, Permanent_Marker, Roboto, Shadows_Into_Light } from "next/font/google";
import localFont from 'next/font/local';



export const stylishFont = Permanent_Marker({
    subsets:['latin'],
    weight:['400']
})

export const anotherStylishFont = Great_Vibes({
    subsets:['latin'],
    weight:['400']
})  

export const adminFont = Roboto({
    subsets:['latin'],
    weight:['400']
})

export const logoFont = localFont({
  src: './fonts/black-mango-regular.woff2',
  display: 'swap',
  variable: '--font-blackmango', // Optional: for CSS variable usage
})

export const mainFont = localFont({
    src:'./fonts/averta_standard.woff2',
    display:'swap',
    
})

export const magerFont = localFont({
    src: './fonts/mager_font.woff2',
    display: 'swap',
    variable: '--font-mager', // Optional: for CSS variable usage
  })
export const canelaFont = localFont({
    src: './fonts/canela.woff2',
    display: 'swap',
    variable: '--font-canela', // Optional: for CSS variable usage
  })

  export const asulFont = Belleza({
    subsets:['latin'],
    weight:['400']
  })