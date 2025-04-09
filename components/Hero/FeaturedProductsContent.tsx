import { getFeaturedProducts } from '@/actions/products'
import FeaturedProductsClient from './FeaturedProducts'

// Server component to fetch featured products
export default async function FeaturedProductsContent() {
  // Fetch featured products (limit of 4 for carousel)
  const { products } = await getFeaturedProducts(5)
  
  return <FeaturedProductsClient products={products} />
} 