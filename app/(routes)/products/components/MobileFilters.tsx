"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductsFilters } from "./ProductsFilters";
import { useClickAway } from "@/hooks/use-click-away";

interface MobileFiltersProps {
  categories: string[];
  clothTypes: string[];
  searchParams: {
    category?: string;
    clothType?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export function MobileFilters({
  categories,
  clothTypes,
  searchParams
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Close the filter panel when clicking outside
  useClickAway(filterRef, () => {
    if (isOpen) setIsOpen(false);
  });
  
  // Prevent scrolling when the filter panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      <Button 
        variant="outline" 
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
      </Button>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      
      {/* Filter Panel */}
      <div 
        ref={filterRef}
        className={`fixed top-0 left-0 h-full w-[300px] sm:w-[400px] bg-white z-50 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="py-4 overflow-y-auto h-[calc(100%-60px)]">
          <ProductsFilters
            categories={categories}
            clothTypes={clothTypes}
            searchParams={searchParams}
          />
        </div>
      </div>
    </>
  );
} 