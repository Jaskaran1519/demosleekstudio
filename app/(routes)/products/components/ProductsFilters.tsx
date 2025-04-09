"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";

interface ProductsFiltersProps {
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

export function ProductsFilters({ 
  categories, 
  clothTypes, 
  searchParams 
}: ProductsFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedClothTypes, setSelectedClothTypes] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortOption, setSortOption] = useState("");
  
  // Initialize state from URL on mount
  useEffect(() => {
    // Set category filters
    if (params.get("category")) {
      setSelectedCategories(params.getAll("category"));
    } else {
      setSelectedCategories([]);
    }
    
    // Set cloth type filters
    if (params.get("clothType")) {
      setSelectedClothTypes(params.getAll("clothType"));
    } else {
      setSelectedClothTypes([]);
    }
    
    // Set search term
    if (params.get("search")) {
      setSearchValue(params.get("search") || "");
    } else {
      setSearchValue("");
    }
    
    // Set sort option
    if (params.get("sort")) {
      setSortOption(params.get("sort") || "");
    } else {
      setSortOption("");
    }
  }, [params]);
  
  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    // Add categories
    selectedCategories.forEach(category => {
      newParams.append("category", category);
    });
    
    // Add cloth types
    selectedClothTypes.forEach(type => {
      newParams.append("clothType", type);
    });
    
    // Add search
    if (searchValue.trim()) {
      newParams.set("search", searchValue.trim());
    }
    
    // Add sort
    if (sortOption) {
      newParams.set("sort", sortOption);
    }
    
    // Reset to page 1 when applying new filters
    newParams.set("page", "1");
    
    // Update URL
    router.push(`/products?${newParams.toString()}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedClothTypes([]);
    setSearchValue("");
    setSortOption("");
    router.push("/products");
  };
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Toggle cloth type selection
  const toggleClothType = (type: string) => {
    setSelectedClothTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  // Format display name
  const formatDisplayName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Check if any filters are applied
  const hasFilters = selectedCategories.length > 0 || 
                    selectedClothTypes.length > 0 || 
                    searchValue.trim() !== "" ||
                    sortOption !== "";
  
  return (
    <div className="space-y-6">
      {/* <div>
        <h2 className="text-lg font-semibold mb-2">Search</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8"
            />
            {searchValue && (
              <button 
                onClick={() => setSearchValue("")}
                className="absolute right-2 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div> */}
       
      <div>
        <h2 className="text-xl lg:text-2xl mb-2">Sort By</h2>
        <Select 
          value={sortOption} 
          onValueChange={setSortOption}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      <Accordion type="multiple" defaultValue={["categories", "clothTypes"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-xl lg:text-2xl">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {formatDisplayName(category)}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="clothTypes">
          <AccordionTrigger className="text-xl lg:text-2xl">
            Cloth Types
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {clothTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={selectedClothTypes.includes(type)}
                      onCheckedChange={() => toggleClothType(type)}
                    />
                    <label 
                      htmlFor={`type-${type}`}
                      className="text-md lg:text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {formatDisplayName(type)}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex flex-col gap-2 pt-4">
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
        {hasFilters && (
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
} 