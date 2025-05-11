"use client"

import { useEffect, useState } from "react"
import { Category } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/Others/ProductCard"
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton"
import useDebounce from "@/hooks/use-debounce"

interface SearchContentProps {
  searchTerm: string
}

export const SearchContent = ({ searchTerm }: SearchContentProps) => {
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Fetch categories and products based on search term
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setCategories([])
        setProducts([])
        return
      }

      setIsLoading(true)

      try {
        // Fetch categories
        const metadataResponse = await fetch(`/api/products/metadata`)
        const metadataData = await metadataResponse.json()
        
        // Filter categories that match the search term
        const filteredCategories = metadataData.categories.filter((category: string) => 
          category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        setCategories(filteredCategories)

        // Fetch products
        const productsResponse = await fetch(
          `/api/products?search=${encodeURIComponent(debouncedSearchTerm)}&pageSize=8`
        )
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchTerm])

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Render skeleton loaders
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <ProductCardSkeleton key={i} />)
  }

  return (
    <div className="px-4 py-2 w-full h-full">
      {isLoading ? (
        <div className="space-y-6 w-full">
          {/* Category skeletons */}
          <div className="space-y-2 w-full">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="flex space-x-3 overflow-x-auto pb-2 w-full">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
          
          {/* Product skeletons */}
          <div className="space-y-2 w-full">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="flex space-x-4 overflow-x-auto w-full pb-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-[200px] flex-shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          {/* Categories section */}
          {categories.length > 0 && (
            <div className="mb-8 w-full">
              <h2 className="text-xl font-bold mb-4 text-center">Categories</h2>
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div className="flex space-x-3 min-w-full">
                  {categories.map((category) => (
                    <a 
                      key={category} 
                      href={`/products?category=${category}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex-shrink-0 bg-gray-100 text-gray-800"
                    >
                      {formatCategoryName(category)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products section */}
          {products.length > 0 && (
            <div className="w-full">
              {categories.length > 0 && <Separator className="my-6" />}
              <h2 className="text-xl font-bold mb-4 text-center">Products</h2>
              <div className="w-full overflow-x-auto pb-4 no-scrollbar">
                <div className="flex space-x-6 min-w-full">
                  {products.map((product) => (
                    <div key={product.id} className="w-[220px] flex-shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results message */}
          {categories.length === 0 && products.length === 0 && debouncedSearchTerm.length >= 2 && (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-lg text-muted-foreground text-center">
                No results found for "{debouncedSearchTerm}"
              </p>
            </div>
          )}

          {/* Initial state or too short search term */}
          {debouncedSearchTerm.length < 2 && (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-lg text-muted-foreground text-center">
                Type at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchContent