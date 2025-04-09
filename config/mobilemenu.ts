// types.ts
export interface MenuItem {
    id: string;
    title: string;
    link?: string;
    children?: MenuItem[];
  }
  
export const menuData: MenuItem[] = [
    {
      id: "new-arrivals",
      title: "New Arrivals",
      link: "/products?sort=newest&page=1"
    },
    {
      id: "premium-wear",
      title: "Premium Wear",
      link: "/products?sort=price-desc&page=1"
    },
    {
      id: "shoes",
      title: "Shoes",
      link: "#"
    },
    {
      id: "shop-by-category",
      title: "Shop by Category",
      children: [
        { id: "men", title: "Men", link: "/men" },
        { id: "women", title: "Women", link: "/women" },
        { id: "children", title: "Children", link: "/kidswear" }
      ]
    },
    {
      id: "wishlist",
      title: "Wishlist",
      link: "/wishlist"
    },
    {
      id: "about",
      title: "About Sleek Studio",
      link: "/about"
    },
    {
      id: "contact",
      title: "Contact",
      link: "/contact"
    }
  ];