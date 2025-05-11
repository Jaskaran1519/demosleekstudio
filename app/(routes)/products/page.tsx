"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/Others/ProductCard";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import useDebounce from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get("page");
  const categoryParams = searchParams?.getAll("category") || [];
  const clothTypeParams = searchParams?.getAll("clothType") || [];
  const sortParam = searchParams?.get("sort");

  // Search term state (local)
  const [searchTerm, setSearchTerm] = useState(() => {
    // Correctly initialize from URL
    return searchParams?.get("search") || "";
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Add an effect to sync the search term from URL parameter
  useEffect(() => {
    const searchFromUrl = searchParams?.get("search") || "";
    if (searchTerm !== searchFromUrl) {
      console.log("Syncing search term from URL:", searchFromUrl);
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Products and loading states
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [clothTypes, setClothTypes] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParams);
  const [selectedClothTypes, setSelectedClothTypes] = useState<string[]>(clothTypeParams);
  const [sortOption, setSortOption] = useState(sortParam || "");

  // Refs for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore]
  );

  // Effect to initialize categories and cloth types
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/products/metadata");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
          setClothTypes(data.clothTypes);
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchMetadata();
  }, []);

  // Initialize filter states from URL only once on mount
  useEffect(() => {
    setSelectedCategories(categoryParams);
    setSelectedClothTypes(clothTypeParams);
    setSortOption(sortParam || "");
  }, []);

  // Effect to update URL when search term changes
  useEffect(() => {
    // Debug: log search term changes
    console.log("Search term changed:", {
      current: debouncedSearchTerm,
      previous: searchParams?.get("search"),
    });

    if (debouncedSearchTerm === searchParams?.get("search")) return;

    // Debug: log update action
    console.log("Updating URL with search:", debouncedSearchTerm);

    updateUrlWithFilters({
      search: debouncedSearchTerm || null,
      page: "1", // Reset to page 1 when search changes
    });

    // Reset products and load first page when search changes
    setProducts([]);
    setCurrentPage(1);
    setIsLoading(true);
    fetchProducts(1, true);
  }, [debouncedSearchTerm]);

  // Effect to fetch products when URL params change
  useEffect(() => {
    // Skip initial render
    if (typeof window === "undefined") return;

    // Get current page from URL or default to 1
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);

    // Update local state to match URL params
    setSelectedCategories(categoryParams);
    setSelectedClothTypes(clothTypeParams);
    setSortOption(sortParam || "");

    // Fetch products
    fetchProducts(page, true);
  }, [searchParams?.toString()]); // Use toString() to avoid re-renders with same params

  // Function to build the query string for API calls
  const buildQueryString = (page: number, reset: boolean = false) => {
    const params = new URLSearchParams();

    // Add page parameter
    params.append("page", page.toString());
    params.append("limit", PAGE_SIZE.toString());

    // Add category filters
    if (categoryParams.length > 0) {
      categoryParams.forEach((cat) => {
        params.append("category", cat);
      });
    }

    // Add cloth type filters
    if (clothTypeParams.length > 0) {
      clothTypeParams.forEach((type) => {
        params.append("clothType", type);
      });
    }

    // Add search term
    const search = searchParams?.get("search");
    if (search) {
      params.append("search", search);
    }

    // Add sort parameter
    const sort = searchParams?.get("sort");
    if (sort) {
      params.append("sort", sort);
    }

    return params.toString();
  };

  // Function to fetch products from the API
  const fetchProducts = async (page: number, reset: boolean = false) => {
    try {
      setIsLoading(true);
      if (reset) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
      }

      const queryString = buildQueryString(page, reset);
      const response = await fetch(`/api/products?${queryString}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Update products state
      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      // Update total count and hasMore flag
      setTotalProducts(data.total);
      setHasMore(data.products.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Function to load more products (for infinite scroll)
  const loadMoreProducts = () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage);
  };

  // Function to update URL with filters
  const updateUrlWithFilters = (
    updatedParams: Record<string, string | null>
  ) => {
    const newParams = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );

    // Update or remove params based on the updatedParams object
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchTerm("");
    const newParams = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );
    newParams.delete("search");
    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  // Format display name
  const formatDisplayName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Skeleton placeholders
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <ProductCardSkeleton key={i} />);
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);

    const newParams = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );

    newParams.delete("category");
    newCategories.forEach((cat) => {
      newParams.append("category", cat);
    });

    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  // Toggle cloth type selection
  const toggleClothType = (type: string) => {
    const newClothTypes = selectedClothTypes.includes(type)
      ? selectedClothTypes.filter((t) => t !== type)
      : [...selectedClothTypes, type];

    setSelectedClothTypes(newClothTypes);

    const newParams = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );

    newParams.delete("clothType");
    newClothTypes.forEach((type) => {
      newParams.append("clothType", type);
    });

    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateUrlWithFilters({
      sort: value || null,
      page: "1",
    });
  };

  return (
    <Container>
        {/* Header section with responsive layout */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          {/* Heading - always on top in mobile, left in desktop */}
          <h1 className="text-2xl font-bold tracking-tight">Our Collection</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[200px] md:w-[250px]"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
  
            {/* Filters container - side by side in both mobile and desktop */}
            <div className="flex flex-row gap-3">
              {/* Category filter */}
              <div className="w-1/2 sm:w-auto">
                <Select
                  value={selectedCategories.length === 1 ? selectedCategories[0] : ""}
                  onValueChange={(value) => {
                    if (value) {
                      // Clear previous categories and set just this one
                      setSelectedCategories([value]);
  
                      const newParams = new URLSearchParams(
                        Array.from(searchParams?.entries() || [])
                      );
  
                      newParams.delete("category");
                      newParams.append("category", value);
                      newParams.set("page", "1");
                      router.push(`/products?${newParams.toString()}`, {
                        scroll: false,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {formatDisplayName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Sort filter */}
              <div className="w-1/2 sm:w-auto">
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cloth type filters in horizontal scrollable row */}
        <div className="mt-4 w-full overflow-x-auto">
          <div className="flex space-x-3 pb-2 whitespace-nowrap">
            {clothTypes.map((type) => (
              <div 
                key={type} 
                onClick={() => toggleClothType(type)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer flex-shrink-0
                  ${selectedClothTypes.includes(type) 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {formatDisplayName(type)}
              </div>
            ))}
          </div>
        </div>
  
        {/* Active filters display */}
        {(categoryParams.length > 0 || sortParam) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryParams.length > 0 &&
              categoryParams.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-2 py-0.5 text-xs"
                  onClick={() => toggleCategory(category)}
                >
                  Category: {category.replace(/_/g, " ")}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
  
            {sortParam && (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                Sort:{" "}
                {sortParam === "price-asc"
                  ? "Price: Low to High"
                  : sortParam === "price-desc"
                  ? "Price: High to Low"
                  : sortParam === "popularity"
                  ? "Popularity"
                  : "Newest"}
              </Badge>
            )}
          </div>
        )}
  
        <Separator className="my-4" />
  
        {/* Products grid - now full width */}
        <div>
          {isLoading && products.length === 0 ? (
            // Show skeleton loaders when initially loading
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {renderSkeletons(PAGE_SIZE)}
            </div>
          ) : products.length === 0 ? (
            // No products found message
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-xl font-medium text-muted-foreground mb-4">
                No products found
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Try adjusting your filters or search term to find what you're
                looking for.
              </p>
            </div>
          ) : (
            // Products grid with infinite loading
            <div className="space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => {
                  // If it's the last item, add ref for infinite scrolling
                  if (index === products.length - 1) {
                    return (
                      <div key={product.id} ref={lastProductRef}>
                        <ProductCard product={product} />
                      </div>
                    );
                  }
                  return <ProductCard key={product.id} product={product} />;
                })}
  
                {/* Show skeleton loaders when loading more */}
                {isLoadingMore && renderSkeletons(4)}
              </div>
  
              {/* Loading indicator for mobile */}
              {isLoadingMore && (
                <div className="flex justify-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Loading more products...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
    </Container>
  );
}