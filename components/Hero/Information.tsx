import React from "react";
import Image from "next/image";
import FadeIn from "../FadeIn";

const Information: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start bg-primary gap-12  mx-auto py-12 lg:py-24 px-4 md:px-8 xl:px-12 mt-5 md:mt-10">
        <div className="lg:w-[30%] lg:sticky lg:top-8 flex justify-center">
          <div className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Sleek Studio Logo"
              width={224}
              height={224}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

      <div className="lg:w-[70%] flex flex-col text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-white ">
          We're Sleek Studio, an Indian clothing brand crafting the best.
        </h1>

        <p className="text-lg md:text-xl  font-medium text-gray-200">
          Timeless, trustworthy staples crafted for longevity across all
          seasons. Our sustainable clothing for both men and women comes with
          guaranteed provenance but unlimited possibilities
        </p>
      </div>
    </div>
  );
};

export default Information;
