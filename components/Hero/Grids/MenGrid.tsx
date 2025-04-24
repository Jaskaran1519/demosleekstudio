import Image from "next/image";

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

const MenGrid = () => {
  const images: ImageItem[] = [
    {
      id: "1",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406316/ocizj2lkxpc0warzne2v_ktqp0i.webp",
      name: "Image 1",
    },
    {
      id: "2",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406316/hbnift7ic8ex4twf2vrt_iaqba4.webp",
      name: "Image 2",
    },
    {
      id: "3",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406309/jeshs238fus80tu9mrqy_dtlctb.webp",
      name: "Image 3",
    },
    {
      id: "4",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/yswwbzjz183hixr6whpr_roq0ie.webp",
      name: "Image 4",
    },
    {
      id: "5",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/nu3ch4gpjfn13jbx3di9_g6rdlh.webp",
      name: "Image 5",
    },
    {
      id: "6",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406308/bwiqafyfnuna6bzkhmtq_ix3xgh.webp",
      name: "Image 6",
    },
    {
      id: "7",
      url: "https://res.cloudinary.com/dtopsoqao/image/upload/v1745406307/jfwq4ueyaojkdvyuaoj7_mxouew.webp",
      name: "Image 7",
    },
  ];

  const ImageBox = ({
    image,
    className,
  }: {
    image: ImageItem;
    className: string;
  }) => (
    <div
      className={`${className} relative rounded-lg overflow-hidden group bg-gray-100 shrink-0`}
    >
      <Image src={image.url} alt={image.name} fill  className="object-cover w-full h-full" style={{ objectPosition: 'center 10%' }}  />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <p className="text-white font-medium text-lg">{image.name}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Desktop grid layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 h-screen">
        <ImageBox image={images[0]} className="col-span-5 row-span-8" />
        <ImageBox
          image={images[1]}
          className="col-span-2 row-span-4 col-start-1 row-start-9"
        />
        <ImageBox
          image={images[2]}
          className="col-span-3 row-span-4 col-start-3 row-start-9"
        />

        <ImageBox
          image={images[3]}
          className="col-span-4 row-span-6 col-start-6 row-start-1"
        />
        <ImageBox
          image={images[4]}
          className="col-span-3 row-span-6 col-start-10 row-start-1"
        />
        <ImageBox
          image={images[5]}
          className="col-span-3 row-span-6 col-start-6 row-start-7"
        />
        <ImageBox
          image={images[6]}
          className="col-span-4 row-span-6 col-start-9 row-start-7"
        />
      </div>

      {/* Mobile horizontal scroll layout */}
      <div className="md:hidden overflow-x-auto no-scrollbar">
        <div className="flex gap-x-4 px-1">
          {images.map((image) => (
            <ImageBox
              key={image.id}
              image={image}
              className="w-[80vw] h-[50vw]" // Maintain aspect ratio box
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenGrid;
