import { Category as PrismaCategory, ClothType as PrimeClothType } from "@prisma/client";

// export enum Category {
//   MEN = "MEN",
//   WOMEN = "WOMEN",
//   KIDS = "KIDS"
// } 

// export type Category = "MEN" | "WOMEN" | "KIDS";

export enum ClothType {
  BLAZER = "BLAZER",
  COAT = "COAT",
  SHIRT = "SHIRT",
  SUIT = "SUIT",
  TUXEDO = "TUXEDO",
  PANTS = "PANTS",
  SHOES="SHOES",
  DRESS = "DRESS",
  SWEATER = "SWEATER",
  JACKET = "JACKET",
  VEST = "VEST",
  T_SHIRT = "T_SHIRT",
  LEHNGA = "LEHNGA",
  KURTI="KURTI",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  salePrice: number | null;
  inventory: number;
  noBgImage: string;
  modelImage: string;
  images: string[];
  category: PrismaCategory;
  clothType: PrimeClothType;
  colors?: string[];
  tags: string[];
  sizes: string[];
  customisations?: any;
  timesSold?: number;
  isActive: boolean;
  homePageFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  wishedByIds: string[];
} 