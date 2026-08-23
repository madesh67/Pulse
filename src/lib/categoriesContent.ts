// Centralized content configuration for Section 02 — Shop by Category
export interface CategoryItem {
  id: string;
  index: string;
  categoryTag: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  href: string;
}

export interface ShopByCategoryContent {
  sectionId: string;
  sectionIndex: string;
  sectionTag: string;
  headline: string;
  introCopy: string;
  categories: CategoryItem[];
}

export const shopByCategoryContent: ShopByCategoryContent = {
  sectionId: "categories",
  sectionIndex: "02",
  sectionTag: "EXPLORE PULSE",
  headline: "SHOP BY CATEGORY",
  introCopy:
    "Explore the products, modular straps, specialist editions, and essentials designed around the PULSE ecosystem.",

  categories: [
    {
      id: "smartwatches",
      index: "01",
      categoryTag: "TIMEPIECES",
      name: "Smartwatches",
      description:
        "Precision-milled titanium smartwatches engineered with high-contrast displays and adaptive intelligence.",
      image: "/assets/categories/smartwatches.jpg",
      imageAlt: "PULSE Smartwatches collection in aerospace grade titanium",
      ctaText: "EXPLORE COLLECTION",
      href: "/shop?category=smartwatches",
    },
    {
      id: "straps",
      index: "02",
      categoryTag: "ACCESSORIES",
      name: "Straps & Bands",
      description:
        "Interchangeable fluoroelastomer, woven ballistic nylon, and titanium link bracelets.",
      image: "/assets/categories/straps.jpg",
      imageAlt: "PULSE interchangeable straps and bands collection",
      ctaText: "EXPLORE COLLECTION",
      href: "/shop?category=straps",
    },
    {
      id: "editions",
      index: "03",
      categoryTag: "SPECIALIST",
      name: "Specialist Editions",
      description:
        "Diamond-like carbon and high-altitude expedition timepieces crafted for extreme pursuits.",
      image: "/assets/categories/editions.jpg",
      imageAlt: "PULSE Specialist Editions collection in matte black DLC finish",
      ctaText: "EXPLORE COLLECTION",
      href: "/shop?category=specialist",
    },
    {
      id: "charging",
      index: "04",
      categoryTag: "ECOSYSTEM",
      name: "Charging & Power",
      description:
        "Magnetic fast-charging docks and high-efficiency wireless power accessories.",
      image: "/assets/categories/charging.jpg",
      imageAlt: "PULSE magnetic fast charging dock in brushed titanium and white ceramic",
      ctaText: "EXPLORE COLLECTION",
      href: "/shop?category=charging",
    },
  ],
};
