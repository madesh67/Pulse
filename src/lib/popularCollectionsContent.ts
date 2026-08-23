// Centralized content configuration for Section 03 — Popular Collections (Product Grid)
export interface CollectionItem {
  id: string;
  index: string;
  category: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  href: string;
}

export interface PopularCollectionsContent {
  sectionId: string;
  sectionIndex: string;
  sectionTag: string;
  headline: string;
  introCopy: string;
  collections: CollectionItem[];
}

export const popularCollectionsContent: PopularCollectionsContent = {
  sectionId: "collections",
  sectionIndex: "03",
  sectionTag: "POPULAR COLLECTIONS",
  headline: "SELECTED EXPRESSIONS OF PULSE.",
  introCopy:
    "Discover the curated collections engineered for distinct horological, active, expedition, and specialist disciplines.",

  collections: [
    {
      id: "titanium-heritage",
      index: "01",
      category: "FLAGSHIP",
      name: "Titanium Heritage",
      description:
        "A pure expression of the PULSE design language, sculpted in satin-brushed titanium with an integrated metal bracelet.",
      image: "/assets/collections/titanium-heritage.jpg",
      imageAlt: "PULSE Titanium Heritage smartwatch with titanium bracelet",
      ctaText: "EXPLORE COLLECTION",
      href: "#collection-titanium",
    },
    {
      id: "hydro-active",
      index: "02",
      category: "PERFORMANCE",
      name: "Hydro Active",
      description:
        "Engineered for aquatic depth and high-velocity training with a breathable tubular fluoroelastomer ocean strap.",
      image: "/assets/collections/hydro-active.jpg",
      imageAlt: "PULSE Hydro Active smartwatch with tubular fluoroelastomer ocean strap",
      ctaText: "EXPLORE COLLECTION",
      href: "#collection-active",
    },
    {
      id: "stealth-obsidian",
      index: "03",
      category: "SPECIALIST",
      name: "Stealth Obsidian",
      description:
        "Finished in matte black diamond-like carbon with knurled physical detents and a high-contrast night matrix.",
      image: "/assets/collections/stealth-obsidian.jpg",
      imageAlt: "PULSE Stealth Obsidian smartwatch in matte black DLC finish",
      ctaText: "EXPLORE COLLECTION",
      href: "#collection-stealth",
    },
    {
      id: "alpine-expedition",
      index: "04",
      category: "EXPEDITION",
      name: "Alpine Expedition",
      description:
        "Engineered for high-altitude endurance with a reinforced titanium casing and a high-tensile woven ballistic strap.",
      image: "/assets/collections/alpine-expedition.jpg",
      imageAlt: "PULSE Alpine Expedition smartwatch with woven ballistic nylon strap",
      ctaText: "EXPLORE COLLECTION",
      href: "#collection-expedition",
    },
  ],
};
