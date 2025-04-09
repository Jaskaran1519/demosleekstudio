import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        // Check if item already exists
        if (state.items.some(i => i.productId === item.productId)) {
          return state;
        }
        
        // Add new item with a unique ID
        return { items: [...state.items, { ...item, id: crypto.randomUUID() }] };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId)
      })),
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlist; 