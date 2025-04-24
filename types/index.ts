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
  JEANS = "JEANS",
  DRESS = "DRESS",
  SKIRT = "SKIRT",
  SWEATER = "SWEATER",
  JACKET = "JACKET",
  VEST = "VEST",
  SHORTS = "SHORTS",
  HOODIE = "HOODIE",
  T_SHIRT = "T_SHIRT",
  POLO = "POLO",
  TANK_TOP = "TANK_TOP",
  CARDIGAN = "CARDIGAN",
  BLOUSE = "BLOUSE",
  LEHNGA = "LEHNGA",
  KURTI="KURTI",
  TOP = "TOP",
  LEGGINGS = "LEGGINGS",
  JUMPSUIT = "JUMPSUIT",
  ROMPER = "ROMPER",
  BODYSUIT = "BODYSUIT",
  SWIMWEAR = "SWIMWEAR",
  UNDERWEAR = "UNDERWEAR",
  SOCKS = "SOCKS",
  ACCESSORIES = "ACCESSORIES"
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