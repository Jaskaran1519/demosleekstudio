import Image from "next/image"
import Link from "next/link"

// Category data
const categories = [
  {
    id: 1,
    title: "Men",
    image: "https://res.cloudinary.com/dk6z5ui4f/image/upload/v1744199175/1000060096-Picsart-AiImageEnhancer_nvvz9h.png",
    link: "/men"
  },
  {
    id: 2,
    title: "Women",
    image: "https://res.cloudinary.com/dk6z5ui4f/image/upload/v1744199174/cover-Picsart-AiImageEnhancer_yg7tir.png",
    link: "/women"
  },
  {
    id: 3,
    title: "Children",
    image: "https://res.cloudinary.com/dk6z5ui4f/image/upload/v1744199939/Cream_Brown_Promotion_Flyer_Buy_1_Get_1_Sale_Instagram_Post_1_zcm1er.png",
    link: "/kidswear"
  },
]

export const CategorySection = () => {
  return (
    <div className="w-full">
      {/* Container for categories */}
      <div className="w-full">
        
        {/* Full width on small screens, side by side on medium and up */}
        <div className="flex w-full flex-col md:flex-row">
          {categories.map((category) => (
            <CategoryBox key={category.id} category={category} className="w-full md:w-1/3" />
          ))}
        </div>
      </div>
    </div>
  )
}

// CategoryBox component
interface CategoryBoxProps {
  category: {
    id: number
    title: string
    image: string
    link: string
  }
  className?: string
}

const CategoryBox = ({ category, className = "" }: CategoryBoxProps) => {
  return (
    <Link 
      href={category.link}
      className={`block group transition-transform ${className}`}
    >
      <div className="bg-gray-50 overflow-hidden w-full">
        {/* Image container with square aspect ratio */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Title overlay positioned at bottom right */}
          <div className="absolute inset-0 flex items-end justify-end">
            <h3 className="font-bold text-xl md:text-2xl text-white p-4">{category.title.toUpperCase()}</h3>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategorySection