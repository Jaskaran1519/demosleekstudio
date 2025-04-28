// WomenGrid.tsx - Fixed version
import Image from "next/image";
import Link from "next/link";

interface ImageItem {
  id: string;
  url: string;
  name: string;
  link: string;
}

const WomenGrid = () => {
  const images: ImageItem[] = [
    {
      id: "1",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406309/z1mopl3l4ww2is3jyt0p_pdyhzd.webp",
      name: "Elegant Dresses",
      link: "/product/1",
    },
    {
      id: "2",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/zpjlirzzmq0j912az5uy_udnsmm.webp",
      name: "Chic Tops",
      link: "/product/2",
    },
    {
      id: "3",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406307/skqpk8pnpi9vc0cifp52_s7vsfx.webp",
      name: "Stylish Skirts",
      link: "/product/3",
    },
    {
      id: "4",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745407272/uyvos6l3uznkky2jzv70_hxx8oa.webp",
      name: "Lehengas",
      link: "/products?category=WOMEN&clothType=LEHNGA&page=1",
    },
    {
      id: "5",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745407271/c36ne4zgjrwymmau8vo6_kfw3cz.webp",
      name: "Suit Sets",
      link: "/products?category=WOMEN&clothType=SUIT&page=1",
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
            priority={['1', '2'].includes(image.id)}
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
      {/* Desktop Mosaic */}
      <div className="hidden md:grid grid-cols-6 auto-rows-auto gap-4 md:gap-6">
        <ImageBox
          image={images[0]}
          className="col-span-4 row-span-4 col-start-1 row-start-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[1]}
          className="col-span-2 row-span-2 col-start-5 row-start-1 aspect-[4/5]"
        />
        <ImageBox
          image={images[2]}
          className="col-span-2 row-span-2 col-start-5 row-start-3 aspect-[4/5]"
        />
        <ImageBox
          image={images[3]}
          className="col-span-3 row-span-2 col-start-1 row-start-5 aspect-[4/5]"
        />
        <ImageBox
          image={images[4]}
          className="col-span-3 row-span-2 col-start-4 row-start-5 aspect-[4/5]"
        />
      </div>

      {/* Mobile 2-column stack */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <ImageBox
            key={img.id}
            image={img}
            className={`${
              i === images.length - 1 && images.length % 2 !== 0 ? "col-span-2" : "col-span-1"
            } aspect-[9/16]`}
          />
        ))}
      </div>
    </div>
  );
};

export default WomenGrid;