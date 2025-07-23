'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define the content type
type ContentItem = {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  description?: string;
};

// Define the props type
type CategoryContentProps = {
  category: 'MEN' | 'WOMEN' | 'KIDS';
};

// Content arrays for each category
const menContent: ContentItem[] = [
  {
    id: 'men-1',
    title: 'Blazers',
    imageUrl: '/mencategory/blazer.jpg',
    link: '/products?category=MEN&clothType=BLAZER&page=1',
    description: 'Comfortable and stylish casual wear for everyday occasions'
  },
  {
    id: 'men-2',
    title: 'Shirts',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178052/shirt-Picsart-AiImageEnhancer_yklims.png',
    link: '/products?category=MEN&clothType=SHIRT&page=1',
    description: 'Elegant formal wear for special occasions'
  },
  {
    id: 'men-3',
    title: 'Suits',
    imageUrl: '/mencategory/suit.webp',
    link: '/products?category=MEN&clothType=SUIT&page=1',
    description: 'Performance-focused athletic wear'
  },
  {
    id: 'men-4',
    title: 'Tuxedos',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178188/tuxedo-Picsart-AiImageEnhancer_uhidba.png',
    link: '/products?category=MEN&clothType=TUXEDO&page=1',
    description: 'Complete your look with our premium accessories'
  }
];

const womenContent: ContentItem[] = [
  {
    id: 'women-1',
    title: 'Saree',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178419/saree_qzxtuu.png',
    link: '#',
    description: 'Trendy and comfortable casual wear for everyday style'
  },
  {
    id: 'women-2',
    title: 'Salwaar Kameez',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178445/suit_bdm1t3.png',
    link: '#',
    description: 'Sophisticated formal wear for special occasions'
  },
  {
    id: 'women-3',
    title: 'Party Wear',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178448/party_of2zp0.png',
    link: '#',
    description: 'Stunning party wear to make you stand out'
  },
  {
    id: 'women-4',
    title: 'Lehnga',
    imageUrl: 'https://res.cloudinary.com/dtopsoqao/image/upload/v1744178442/lehnga_kwt063.png',
    link: '#',
    description: 'Elegant accessories to complement your style'
  }
];

const kidsContent: ContentItem[] = [
  {
    id: 'kids-1',
    title: 'Boys Collection',
    imageUrl: '/images/kids/boys.jpg',
    link: '/kids/boys',
    description: 'Comfortable and durable clothing for active boys'
  },
  {
    id: 'kids-2',
    title: 'Girls Collection',
    imageUrl: '/images/kids/girls.jpg',
    link: '/kids/girls',
    description: 'Colorful and stylish clothing for girls'
  },
  {
    id: 'kids-3',
    title: 'Infants Collection',
    imageUrl: '/images/kids/infants.jpg',
    link: '/kids/infants',
    description: 'Soft and gentle clothing for your little ones'
  },
  {
    id: 'kids-4',
    title: 'Accessories',
    imageUrl: '/images/kids/accessories.jpg',
    link: '/kids/accessories',
    description: 'Fun and practical accessories for children'
  }
];

const CategoryContent: React.FC<CategoryContentProps> = ({ category }) => {
  // Select the appropriate content based on the category
  const content = React.useMemo(() => {
    switch (category) {
      case 'MEN':
        return menContent;
      case 'WOMEN':
        return womenContent;
      case 'KIDS':
        return kidsContent;
      default:
        return [];
    }
  }, [category]);

  // Get the category title
  const categoryTitle = React.useMemo(() => {
    switch (category) {
      case 'MEN':
        return 'Men\'s Collection';
      case 'WOMEN':
        return 'Women\'s Collection';
      case 'KIDS':
        return 'Kids\' Collection';
      default:
        return '';
    }
  }, [category]);

  return (
    <div className="w-full ">
      
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto">
        {content.map((item) => (
          <Link 
            href={item.link} 
            key={item.id}
            className="group relative overflow-hidden transition-shadow duration-300"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">{item.title}</h3>
             
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryContent; 