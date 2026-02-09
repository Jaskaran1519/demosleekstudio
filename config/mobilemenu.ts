// types.ts
export interface MenuItem {
    id: string;
    title: string;
    link?: string;
    children?: MenuItem[];
  }
  
export const menuData: MenuItem[] = [
    {
      id: "men",
      title: "Men",
      children: [
        { id: "men-coat", title: "Coat", link: "/products?category=MEN&clothType=COAT" },
        { id: "men-blazer", title: "Blazer", link: "/products?category=MEN&clothType=BLAZER" },
        { id: "men-shirt", title: "Shirt", link: "/products?category=MEN&clothType=SHIRT" }
      ]
    },
    {
      id: "women",
      title: "Women",
      children: [
        { id: "women-lehnga", title: "Lehnga", link: "/products?category=WOMEN&clothType=LEHNGA" },
        { id: "women-suit", title: "Suit", link: "/products?category=WOMEN&clothType=SUIT" },
        { id: "women-kurti", title: "Kurti", link: "/products?category=WOMEN&clothType=KURTI" }
      ]
    },
    {
      id: "wishlist",
      title: "Wishlist",
      link: "/wishlist"
    },
    {
      id: "about",
      title: "About",
      link: "/about"
    },
    {
      id: "contact",
      title: "ContactUs",
      link: "/contact"
    }
  ];