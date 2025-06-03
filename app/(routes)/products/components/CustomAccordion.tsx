"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@prisma/client";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface CustomAccordionProps {
  product: Product;
}


export const CustomAccordion = ({ product }: CustomAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: "Description",
      content: <p className="text-muted-foreground">{product.description}</p>,
    },
    {
      title: "Delivery Details",
      content: <div></div>,
    },
    {
      title: "Payment Methods",
      content: <div></div>,
    },
  ];
  

  return (
    <div className="space-y-2">
      {accordionItems.map((item, index) => (
        <div key={index} className=" rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-lg md:text-xl lg:text-2xl">{item.title}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-4 border-t ml-3">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}; 