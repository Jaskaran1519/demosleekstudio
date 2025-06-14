"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/Others/ProductCard";
// import { Heading } from "@/components/ui/heading"; // Not used
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
// import { Checkbox } from "@/components/ui/checkbox"; // Not used
// import { ScrollArea } from "@/components/ui/scroll-area"; // Not used

const PAGE_SIZE = 12;

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State Initialization from URL (done once or driven by effects) ---
  const [searchTerm, setSearchTerm] = useState(() => searchParams?.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => searchParams?.getAll("category") || []);
  const [selectedClothTypes, setSelectedClothTypes] = useState<string[]>(() => searchParams?.getAll("clothType") || []);
  const [sortOption, setSortOption] = useState(() => searchParams?.get("sort") || "");
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams?.get("page") || "1", 10));

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Metadata states
  const [categories, setCategories] = useState<string[]>([]);
  const [clothTypes, setClothTypes] = useState<string[]>([]);

  // --- SWR Key and Data Fetching ---
  const productsKey = useCallback(() => {
    // Create a stable key that works on both server and client
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", PAGE_SIZE.toString());

    selectedCategories.forEach((cat) => params.append("category", cat));
    selectedClothTypes.forEach((type) => params.append("clothType", type));

    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }
    if (sortOption) {
      params.append("sort", sortOption);
    }
    return `/api/products?${params.toString()}`;
  }, [currentPage, selectedCategories, selectedClothTypes, debouncedSearchTerm, sortOption]);

  const { data: productsData, error: productsError, isLoading: swrIsLoading } = useSWR(
    productsKey,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // cache for 60s
      keepPreviousData: true, // Optional: for smoother UI transitions on filter changes
    }
  );

  const { data: metadataData } = useSWR('/api/products/metadata', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  useEffect(() => {
    if (metadataData) {
      setCategories(metadataData.categories || []);
      setClothTypes(metadataData.clothTypes || []);
    }
  }, [metadataData]);

  // --- Update URL when local state changes ---
  const updateUrl = useCallback((newParamsData: Record<string, string | string[] | null>) => {
    const currentUrlParams = new URLSearchParams(searchParams?.toString() || "");
    
    Object.entries(newParamsData).forEach(([key, value]) => {
      currentUrlParams.delete(key); // Clear existing values for the key
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => currentUrlParams.append(key, v));
        } else if (value !== "") {
          currentUrlParams.set(key, value as string);
        }
      }
    });
    router.push(`/products?${currentUrlParams.toString()}`, { scroll: false });
  }, [router, searchParams]);


  // --- Effect to Sync Component State from URL Parameters ---
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams?.get("page") || "1", 10);
    const categoriesFromUrl = searchParams?.getAll("category") || [];
    const clothTypesFromUrl = searchParams?.getAll("clothType") || [];
    const sortFromUrl = searchParams?.get("sort") || "";
    const searchFromUrl = searchParams?.get("search") || "";

    // Only update state if it differs from URL, to avoid unnecessary re-renders/SWR triggers
    if (currentPage !== pageFromUrl) setCurrentPage(pageFromUrl);
    if (JSON.stringify(selectedCategories) !== JSON.stringify(categoriesFromUrl)) setSelectedCategories(categoriesFromUrl);
    if (JSON.stringify(selectedClothTypes) !== JSON.stringify(clothTypesFromUrl)) setSelectedClothTypes(clothTypesFromUrl);
    if (sortOption !== sortFromUrl) setSortOption(sortFromUrl);
    if (searchTerm !== searchFromUrl) setSearchTerm(searchFromUrl);

  }, [searchParams?.toString()]); // Use toString() for stable dependency


  // --- Effect to update products from SWR ---
  useEffect(() => {
    if (productsData) {
      if (currentPage === 1) {
        setProducts(productsData.products);
      } else {
        // Append products, ensuring no duplicates
        setProducts((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const newProducts = productsData.products.filter((p: any) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
        });
      }
      setTotalProducts(productsData.totalCount);
      setHasMore(productsData.hasMore);
    } else if (productsError) {
      console.error("Error fetching products:", productsError);
      // Optionally set products to [] or show an error message UI
      setProducts([]);
      setHasMore(false);
    }
  }, [productsData, productsError, currentPage]);


  // --- Effect to reset page and products when filters change ---
  useEffect(() => {
    // This effect triggers when user changes a filter locally
    // (debouncedSearch, category selection, etc.)
    // It should update the URL, which then causes searchParams to change,
    // SWR key to change, and SWR to re-fetch.
    // The actual state reset for currentPage is now handled by `updateUrl` call in filter handlers.
    // If not resetting products here, ensure `currentPage === 1` logic in `useEffect[productsData]` handles it.
    // Consider if this effect is fully needed if filter change handlers always update URL and reset page to 1.

    // Let's ensure products are cleared if page is reset to 1 by filter changes.
    // This is more about reacting to filter changes that imply a new "page 1" dataset.
    const pageFromUrl = parseInt(searchParams?.get("page") || "1", 10);
    if (pageFromUrl === 1 && (
        debouncedSearchTerm !== (searchParams?.get("search") || "") ||
        JSON.stringify(selectedCategories) !== JSON.stringify(searchParams?.getAll("category") || []) ||
        JSON.stringify(selectedClothTypes) !== JSON.stringify(searchParams?.getAll("clothType") || []) ||
        sortOption !== (searchParams?.get("sort") || "")
    )) {
        // If URL implies page 1 due to a filter change that's now reflected in state
        // setProducts([]); // Clears products, SWR will repopulate for the new page 1
    }
    // This effect is tricky because `selectedCategories` etc. are already updated by user actions.
    // The primary driver for SWR refetch is `productsKey` changing.
    // Clearing products here might be too aggressive if SWR `keepPreviousData` is used.
    // Let's simplify: rely on filter handlers to set page=1 in URL.
    // The `useEffect[productsData]` with `currentPage === 1` check handles product replacement.

  }, [debouncedSearchTerm, selectedCategories, selectedClothTypes, sortOption, searchParams]);


  // --- Effect to update URL when debounced search term changes ---
  useEffect(() => {
    const currentUrlSearch = searchParams?.get("search") || "";
    if (debouncedSearchTerm !== currentUrlSearch) {
      updateUrl({ search: debouncedSearchTerm || null, page: "1" });
    }
  }, [debouncedSearchTerm, searchParams, updateUrl]);


  // --- Infinite Scroll ---
  const observer = useRef<IntersectionObserver | null>(null);
  const isLoadingMoreUi = swrIsLoading && currentPage > 1; // For showing "loading more" skeletons

  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMoreUi && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
      // No need to call updateUrl here, as `currentPage` change will trigger SWR
      // and if page needs to be in URL, `useEffect[currentPage]` (if added) or other logic would do it.
      // However, for robust back/forward, page *should* be in URL.
      // Let's make sure currentPage change also updates URL.
      // This is implicitly handled if `useEffect[searchParams.toString()]` syncs `currentPage` state,
      // and SWR key uses `currentPage` state. When `loadMoreProducts` calls `setCurrentPage`,
      // `productsKey` changes, SWR fetches. URL doesn't update page number automatically here.
      // This is a common issue: infinite scroll vs. paginated URL.
      // For now, let's assume infinite scroll doesn't update URL page number continuously.
      // If it should, `updateUrl` needs to be called.
    }
  }, [isLoadingMoreUi, hasMore, currentPage /*, updateUrl (if page needs to be in URL) */]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMoreUi) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingMoreUi, hasMore, loadMoreProducts]
  );


  // --- Event Handlers ---
  const clearSearch = () => {
    setSearchTerm(""); // This will trigger debouncedSearchTerm, then the effect to update URL
  };

  const toggleCategory = (categoryValue: string) => {
    // This function now handles single select logic for category from the <Select>
    // If you want multi-select categories via checkboxes, logic would be different.
    const newSelectedCategories = [categoryValue]; // Single select for now
    setSelectedCategories(newSelectedCategories);
    updateUrl({ category: newSelectedCategories, page: "1" });
  };
  
  const handleCategorySelectChange = (value: string) => {
    if (value) {
        setSelectedCategories([value]); // Assuming single category selection from dropdown
        updateUrl({ category: [value], page: "1" });
    } else {
        // Handle "clear category" if placeholder or a "clear" option is selected
        setSelectedCategories([]);
        updateUrl({ category: null, page: "1" });
    }
  };

  const toggleClothType = (type: string) => {
    const newClothTypes = selectedClothTypes.includes(type)
      ? selectedClothTypes.filter((t) => t !== type)
      : [...selectedClothTypes, type];
    setSelectedClothTypes(newClothTypes);
    updateUrl({ clothType: newClothTypes.length > 0 ? newClothTypes : null, page: "1" });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateUrl({ sort: value || null, page: "1" });
  };

  // --- UI Helpers ---
  const formatDisplayName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />);
  };

  // Derived loading state for initial skeleton display
  const showInitialSkeletons = swrIsLoading && currentPage === 1 && products.length === 0;

  // --- Render ---
  return (
    <Container>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Our Collection</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[200px] md:w-[250px]"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="absolute right-2 top-2.5">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/2 sm:w-auto">
              <Select
                value={selectedCategories.length === 1 ? selectedCategories[0] : ""}
                onValueChange={handleCategorySelectChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Optional: Add an item to clear selection */}
                  {/* <SelectItem value="">All Categories</SelectItem> */}
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatDisplayName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

      { (selectedCategories.length > 0 || selectedClothTypes.length > 0 || sortOption) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="px-2 py-0.5 text-xs cursor-pointer"
              onClick={() => { /* Logic to remove specific category */
                  const newCats = selectedCategories.filter(c => c !== category);
                  setSelectedCategories(newCats);
                  updateUrl({ category: newCats.length > 0 ? newCats : null, page: "1"});
              }}
            >
              Category: {formatDisplayName(category)}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
           {selectedClothTypes.map((clothType) => (
            <Badge
              key={clothType}
              variant="secondary"
              className="px-2 py-0.5 text-xs cursor-pointer"
              onClick={() => toggleClothType(clothType)} // Reuses toggle which handles removal
            >
              Type: {formatDisplayName(clothType)}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {sortOption && (
            <Badge variant="secondary" className="px-2 py-0.5 text-xs cursor-pointer" onClick={() => handleSortChange("")}>
              Sort:{" "}
              {sortOption === "price-asc"
                ? "Price: Low to High"
                : sortOption === "price-desc"
                ? "Price: High to Low"
                : sortOption === "popularity"
                ? "Popularity"
                : formatDisplayName(sortOption)}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      <Separator className="my-4" />

      <div>
        {/* Server and client rendering must match exactly to avoid hydration errors */}
        {/* Handle error state */}
        {productsError && (
            <div className="flex flex-col items-center justify-center h-96">
                 <p className="text-xl font-medium text-red-600 mb-4">
                    Failed to load products
                 </p>
                 <p className="text-sm text-muted-foreground">Please try again later.</p>
            </div>
        )}
        
        {/* Handle loading state - ensure this is rendered the same on server and client */}
        {!productsError && showInitialSkeletons && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderSkeletons(PAGE_SIZE)}
          </div>
        )}
        
        {/* Handle empty state */}
        {!productsError && !showInitialSkeletons && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-xl font-medium text-muted-foreground mb-4">
              No products found
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
        
        {/* Handle products display */}
        {!productsError && !showInitialSkeletons && products.length > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                if (index === products.length - 1) {
                  return (
                    <div key={product.id} ref={lastProductRef}>
                      <ProductCard product={product} />
                    </div>
                  );
                }
                return <ProductCard key={product.id} product={product} />;
              })}
              {isLoadingMoreUi && renderSkeletons(4)}
            </div>
            {isLoadingMoreUi && (
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