

// MenGrid.tsx - Fixed version
import Image from "next/image";
import Link from "next/link";

interface ImageItem {
  id: string;
  url: string;
  name: string;
  link: string;
}

const MenGrid = () => {
  const images: ImageItem[] = [
    {
      id: "1",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406316/ocizj2lkxpc0warzne2v_ktqp0i.webp",
      name: "Casual Shirts",
      link: "/products?category=MEN&clothType=SHIRT&page=1",
    },
    {
      id: "2",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406316/hbnift7ic8ex4twf2vrt_iaqba4.webp",
      name: "Formal Trousers",
      link: "/products?category=MEN&clothType=TROUSER&subCategory=FORMAL&page=1",
    },
    {
      id: "3",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406309/jeshs238fus80tu9mrqy_dtlctb.webp",
      name: "Denim Jackets",
      link: "/products?category=MEN&clothType=JACKET&subCategory=DENIM&page=1",
    },
    {
      id: "4",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/yswwbzjz183hixr6whpr_roq0ie.webp",
      name: "Ethnic Kurta",
      link: "/products?category=MEN&clothType=KURTA&page=1",
    },
    {
      id: "5",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/nu3ch4gpjfn13jbx3di9_g6rdlh.webp",
      name: "Summer Shorts",
      link: "/products?category=MEN&clothType=SHORTS&page=1",
    },
    {
      id: "6",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/bwiqafyfnuna6bzkhmtq_ix3xgh.webp",
      name: "Accessories",
      link: "/products?category=MEN&subCategory=ACCESSORIES&page=1",
    },
    {
      id: "7",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406307/jfwq4ueyaojkdvyuaoj7_mxouew.webp",
      name: "Footwear",
      link: "/products?category=MEN&subCategory=FOOTWEAR&page=1",
    },
  ];

  // --- Fixed ImageBox Component with consistent structure ---
  const ImageBox = ({
    image,
    className,
  }: {
    image: ImageItem;
    className: string;
  }) => (
    <div className={`${className} flex flex-col`}>
      {/* Image Link - Fixed container height and consistent rounding */}
      <Link
        href={image.link}
        className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer"
        style={{ height: "calc(100% - 3rem)" }} // Fixed height calculation
      >
        <div className="relative w-full h-full group">
          <Image
            src={image.url}
            alt={image.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: "center 10%" }}
            priority={['1'].includes(image.id)}
          />
        </div>
      </Link>

      {/* Text Link - Fixed height */}
      <Link
        href={image.link}
        className="h-12 flex items-center justify-center w-full"
      >
        <p className="text-gray-700 font-medium text-xs md:text-lg uppercase text-center truncate px-1">
          {image.name}
        </p>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Desktop Layout: 4-Column Mosaic */}
      <div className="hidden md:grid grid-cols-4 auto-rows-auto gap-4 md:gap-6">
        <ImageBox
          image={images[0]}
          className="col-span-2 row-span-2 aspect-[4/5]"
        />
        <ImageBox
          image={images[1]}
          className="col-span-1 row-span-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[2]}
          className="col-span-1 row-span-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[3]}
          className="col-span-1 row-span-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[4]}
          className="col-span-1 row-span-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[5]}
          className="col-span-2 row-span-1 aspect-[8/5]"
        />
        <ImageBox
          image={images[6]}
          className="col-span-2 row-span-1 aspect-[8/5]"
        />
      </div>

      {/* Mobile Layout: 2-Column Grid with 9:16 aspect ratio */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <ImageBox
            key={img.id}
            image={img}
            className={`${
              images.length % 2 !== 0 && i === images.length - 1
                ? "col-span-2"
                : "col-span-1"
            } aspect-[9/16]`}
          />
        ))}
      </div>
    </div>
  );
};

export default MenGrid;