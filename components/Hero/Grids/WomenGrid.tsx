import Image from "next/image";
import Link from "next/link";

interface ImageItem {
  id: string;
  url: string;
  name: string;
  link: string; // New link field
}

const WomenGrid = () => {
  const images: ImageItem[] = [
    {
      id: "1",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406309/z1mopl3l4ww2is3jyt0p_pdyhzd.webp",
      name: "Image 1",
      link: "/product/1",
    },
    {
      id: "2",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/zpjlirzzmq0j912az5uy_udnsmm.webp",
      name: "Image 2",
      link: "/product/2",
    },
    {
      id: "3",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406307/skqpk8pnpi9vc0cifp52_s7vsfx.webp",
      name: "Image 3",
      link: "/product/3",
    },
    {
      id: "4",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745407272/uyvos6l3uznkky2jzv70_hxx8oa.webp",
      name: "Image 4",
      link: "/products?category=WOMEN&clothType=LEHNGA&page=1",
    },
    {
      id: "5",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745407271/c36ne4zgjrwymmau8vo6_kfw3cz.webp",
      name: "Image 5",
      link: "/products?category=WOMEN&clothType=SUIT&page=1",
    },
  ];

  const ImageBox = ({
    image,
    className,
  }: {
    image: ImageItem;
    className: string;
  }) => (
    <Link
      href={image.link}
      className={`${className} relative overflow-hidden rounded-lg group bg-gray-100 cursor-pointer`}
    >
      <Image
        src={image.url}
        alt={image.name}
        fill
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: "center 10%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <p className="text-white font-medium">{image.name}</p>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto p-4">
      {/* — Desktop Mosaic — */}
      <div className="hidden md:grid grid-cols-6 auto-rows-auto gap-6">
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

      {/* — Mobile 2-column stack — */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <ImageBox
            key={img.id}
            image={img}
            className={`${
              i === images.length - 1 ? "col-span-2" : "col-span-1"
            } aspect-[4/5]`}
          />
        ))}
      </div>
    </div>
  );
};

export default WomenGrid;