"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/Others/ProductCard";
import { ProductsFilters } from "./components/ProductsFilters";
import { MobileFilters } from "./components/MobileFilters";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import useDebounce from "@/hooks/use-debounce";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const categoryParams = searchParams.getAll("category");
  const clothTypeParams = searchParams.getAll("clothType");
  const sortParam = searchParams.get("sort");

  // Search term state (local)
  const [searchTerm, setSearchTerm] = useState(() => {
    // Correctly initialize from URL
    return searchParams.get("search") || "";
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Add an effect to sync the search term from URL parameter
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
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

  // Effect to update URL when search term changes
  useEffect(() => {
    // Debug: log search term changes
    console.log("Search term changed:", {
      current: debouncedSearchTerm,
      previous: searchParams.get("search"),
    });

    if (debouncedSearchTerm === searchParams.get("search")) return;

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
    // Debug: log filter changes
    console.log("Filter params changed:", {
      categories: categoryParams.join(","),
      clothTypes: clothTypeParams.join(","),
      sort: sortParam,
      search: searchParams.get("search"),
    });

    setIsLoading(true);
    setProducts([]);
    setCurrentPage(1);
    fetchProducts(1, true);
  }, [
    categoryParams.join(","),
    clothTypeParams.join(","),
    sortParam,
    searchParams.get("search"),
  ]);

  // Effect to fetch initial products on mount or if page param changes
  useEffect(() => {
    if (pageParam && parseInt(pageParam) !== currentPage) {
      setCurrentPage(parseInt(pageParam));
      fetchProducts(parseInt(pageParam), true);
    } else if (!pageParam && products.length === 0) {
      fetchProducts(1, true);
    }
  }, [pageParam]);

  // Function to build the query string for API calls
  const buildQueryString = (page: number, reset: boolean = false) => {
    const params = new URLSearchParams();

    // Add search if exists
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    // Add categories if they exist
    categoryParams.forEach((category) => {
      params.append("category", category);
    });

    // Add cloth types if exist
    clothTypeParams.forEach((type) => {
      params.append("clothType", type);
    });

    // Add sort if exists
    if (sortParam) {
      params.set("sort", sortParam);
    }

    // Add pagination
    params.set("page", page.toString());
    params.set("pageSize", PAGE_SIZE.toString());

    // When loading more, we want to skip items we already have
    if (!reset) {
      params.set("skip", ((page - 1) * PAGE_SIZE).toString());
    }

    return params.toString();
  };

  // Function to fetch products from the API
  const fetchProducts = async (page: number, reset: boolean = false) => {
    try {
      // Don't fetch if we've reached the end
      if (!reset && !hasMore) return;

      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const queryString = buildQueryString(page, reset);

      // Debug: log API request
      console.log(`Fetching products with query: /api/products?${queryString}`);

      const response = await fetch(`/api/products?${queryString}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Debug: log API response
      console.log(
        `API response: ${data.products.length} products out of ${data.totalCount}`
      );

      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setTotalProducts(data.totalCount);
      setHasMore(data.hasMore);
      setIsLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Function to load more products (for infinite scroll)
  const loadMoreProducts = () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, false);
  };

  // Function to update URL with filters
  const updateUrlWithFilters = (
    updatedParams: Record<string, string | null>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or remove each param based on the provided values
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
    console.log("Clearing search");
    setSearchTerm("");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("search");
    newParams.set("page", "1");
    router.push(`/products?${newParams.toString()}`, { scroll: false });

    // Force a refetch
    setIsLoading(true);
    fetchProducts(1, true);
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  // Skeleton placeholders
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />);
  };

  return (
    <Container className="py-5 md:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header with search and mobile filters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                Our Collection
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore our collection of premium clothing
              </p>
            </div>
            <MobileFilters
              categories={categories}
              clothTypes={clothTypes}
              searchParams={Object.fromEntries(searchParams)}
            />
          </div>

          {/* Search input at the top */}
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Separator className="my-4" />

          {/* Active filters */}
          {(categoryParams.length > 0 ||
            clothTypeParams.length > 0 ||
            debouncedSearchTerm ||
            sortParam) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {debouncedSearchTerm && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                  Search: {debouncedSearchTerm}
                </Badge>
              )}

              {categoryParams.length > 0 &&
                categoryParams.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs"
                  >
                    Category: {category.replace(/_/g, " ")}
                  </Badge>
                ))}

              {clothTypeParams.length > 0 &&
                clothTypeParams.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs"
                  >
                    Type: {type.replace(/_/g, " ")}
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

              <div className="ml-auto">
                <Badge className="bg-black text-white text-xs">
                  {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
                  found
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Main content with sidebar and products */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar - hidden on mobile */}
          <div className="hidden md:block md:col-span-1 sticky top-4 h-[calc(100vh)] overflow-y-auto">
            <ProductsFilters
              categories={categories}
              clothTypes={clothTypes}
              searchParams={Object.fromEntries(searchParams)}
            />
          </div>

          {/* Products grid */}
          <div className="md:col-span-3">
            {isLoading && products.length === 0 ? (
              // Show skeleton loaders when initially loading
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {isLoadingMore && renderSkeletons(3)}
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
        </div>
      </div>
    </Container>
  );
}
