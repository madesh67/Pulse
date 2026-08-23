// Centralized product catalog data for PULSE Shop Page (20 Products across 4 Categories)
export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: "all" | "popular" | "smartwatches" | "straps" | "editions" | "charging";
  categoryLabel: string;
  descriptor: string;
  material: string;
  price: string;
  priceValue: number;
  image: string;
  imageAlt: string;
  availability: string;
  featured: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface ShopCategory {
  id: "all" | "popular" | "smartwatches" | "straps" | "editions" | "charging";
  label: string;
  count: number;
}

export const shopCategories: ShopCategory[] = [
  { id: "all", label: "ALL", count: 20 },
  { id: "popular", label: "POPULAR", count: 6 },
  { id: "smartwatches", label: "SMARTWATCHES", count: 5 },
  { id: "editions", label: "SPECIALIST EDITIONS", count: 5 },
  { id: "straps", label: "STRAPS & BANDS", count: 5 },
  { id: "charging", label: "CHARGING & POWER", count: 5 },
];

export const shopProducts: ShopProduct[] = [
  // =========================================================================
  // 1. SMARTWATCHES (5 Products)
  // =========================================================================
  {
    id: "pulse-nova-pro",
    slug: "pulse-nova-pro",
    name: "PULSE Nova Pro",
    category: "smartwatches",
    categoryLabel: "SMARTWATCHES",
    descriptor: "Inaugural Flagship — Grade-5 Titanium with Always-On LTPO OLED Display",
    material: "Grade-5 Titanium",
    price: "$1,150",
    priceValue: 1150,
    image: "/assets/products/pulse-nova-pro.png",
    imageAlt: "PULSE Nova Pro flagship smartwatch standing in grade-5 titanium",
    availability: "In Stock",
    featured: true,
    isPopular: true,
    isNew: true,
  },
  {
    id: "pulse-aurora-chrono",
    slug: "pulse-aurora-chrono",
    name: "PULSE Aurora Chrono",
    category: "smartwatches",
    categoryLabel: "SMARTWATCHES",
    descriptor: "Edition 01 — Satin Aerospace Titanium with Skeletonized Horological Dial",
    material: "Grade-5 Titanium",
    price: "$1,250",
    priceValue: 1250,
    image: "/assets/products/aurora-chrono.jpg",
    imageAlt: "PULSE Aurora Chrono smartwatch with skeletonized mechanical dial",
    availability: "Limited Allocation",
    featured: true,
    isPopular: true,
  },
  {
    id: "pulse-titanium-heritage",
    slug: "pulse-titanium-heritage",
    name: "PULSE Titanium Heritage",
    category: "smartwatches",
    categoryLabel: "SMARTWATCHES",
    descriptor: "Sculpted Satin Titanium with Integrated Precision Metal Link Bracelet",
    material: "Grade-5 Titanium",
    price: "$1,320",
    priceValue: 1320,
    image: "/assets/collections/titanium-heritage.jpg",
    imageAlt: "PULSE Titanium Heritage smartwatch with sculpted link bracelet",
    availability: "In Stock",
    featured: true,
    isPopular: true,
  },
  {
    id: "pulse-hydro-active",
    slug: "pulse-hydro-active",
    name: "PULSE Hydro Active",
    category: "smartwatches",
    categoryLabel: "SMARTWATCHES",
    descriptor: "Marine-Grade Titanium Architecture with Tubular Fluoroelastomer Ocean Strap",
    material: "Marine Titanium",
    price: "$890",
    priceValue: 890,
    image: "/assets/collections/hydro-active.jpg",
    imageAlt: "PULSE Hydro Active performance smartwatch with ocean strap",
    availability: "In Stock",
    featured: true,
    isPopular: true,
  },
  {
    id: "pulse-monolith-ceramic",
    slug: "pulse-monolith-ceramic",
    name: "PULSE Monolith Ceramic",
    category: "smartwatches",
    categoryLabel: "SMARTWATCHES",
    descriptor: "Zirconia Mirror White Ceramic Smartwatch with Sapphire Crystal Aperture",
    material: "Zirconia Ceramic & Titanium",
    price: "$1,420",
    priceValue: 1420,
    image: "/assets/products/monolith-ceramic.jpg",
    imageAlt: "PULSE Monolith Ceramic smartwatch in mirror white zirconia",
    availability: "Limited Allocation",
    featured: true,
    isNew: true,
  },

  // =========================================================================
  // 2. SPECIALIST EDITIONS (5 Products)
  // =========================================================================
  {
    id: "pulse-stealth-obsidian",
    slug: "pulse-stealth-obsidian",
    name: "PULSE Stealth Obsidian",
    category: "editions",
    categoryLabel: "SPECIALIST EDITIONS",
    descriptor: "Finished in Matte Black Diamond-Like Carbon with High-Contrast Night Matrix",
    material: "Diamond-Like Carbon",
    price: "$1,450",
    priceValue: 1450,
    image: "/assets/collections/stealth-obsidian.jpg",
    imageAlt: "PULSE Stealth Obsidian specialist smartwatch in matte black DLC",
    availability: "Limited Allocation",
    featured: true,
    isPopular: true,
  },
  {
    id: "pulse-alpine-expedition",
    slug: "pulse-alpine-expedition",
    name: "PULSE Alpine Expedition",
    category: "editions",
    categoryLabel: "SPECIALIST EDITIONS",
    descriptor: "Forged Carbon & Blasted Titanium with Altimeter Elevation & Compass Matrix",
    material: "Forged Carbon & Titanium",
    price: "$1,380",
    priceValue: 1380,
    image: "/assets/categories/editions.jpg",
    imageAlt: "PULSE Alpine Expedition specialist timepiece with orange accents",
    availability: "In Stock",
    featured: true,
    isPopular: true,
    isNew: true,
  },
  {
    id: "pulse-aviator-chrono",
    slug: "pulse-aviator-chrono",
    name: "PULSE Aviator Chronometer",
    category: "editions",
    categoryLabel: "SPECIALIST EDITIONS",
    descriptor: "Dual-Timezone UTC Pilot Chronograph with Ceramic Tachymeter Bezel",
    material: "Blasted Titanium & Ceramic",
    price: "$1,580",
    priceValue: 1580,
    image: "/assets/products/aviator-chrono.jpg",
    imageAlt: "PULSE Aviator Chronometer pilot timepiece with UTC dual timezone",
    availability: "In Stock",
    featured: true,
    isNew: true,
  },
  {
    id: "pulse-deep-diver-1000m",
    slug: "pulse-deep-diver-1000m",
    name: "PULSE Deep Diver 1000M",
    category: "editions",
    categoryLabel: "SPECIALIST EDITIONS",
    descriptor: "Helium Escape Valve Marine Titanium Timepiece with Oceanic Depth Matrix",
    material: "Marine Titanium 1000M",
    price: "$1,650",
    priceValue: 1650,
    image: "/assets/products/deep-diver.jpg",
    imageAlt: "PULSE Deep Diver 1000M professional diving smartwatch",
    availability: "Limited Allocation",
    featured: true,
  },
  {
    id: "pulse-solar-tactical",
    slug: "pulse-solar-tactical",
    name: "PULSE Solar Tactical",
    category: "editions",
    categoryLabel: "SPECIALIST EDITIONS",
    descriptor: "Solar-Assisted Forged Composite Case with Night Vision Green HUD Matrix",
    material: "Forged Composite & DLC",
    price: "$1,490",
    priceValue: 1490,
    image: "/assets/products/solar-tactical.jpg",
    imageAlt: "PULSE Solar Tactical rugged forged composite timepiece",
    availability: "In Stock",
    featured: true,
  },

  // =========================================================================
  // 3. STRAPS & BANDS (5 Products)
  // =========================================================================
  {
    id: "pulse-modular-straps-set",
    slug: "pulse-modular-straps-set",
    name: "Modular Straps & Bands Trio",
    category: "straps",
    categoryLabel: "STRAPS & BANDS",
    descriptor: "Complete Atelier Trio: Fluoroelastomer Ocean, Woven Ballistic & Titanium Link",
    material: "Multi-Material Set",
    price: "$340",
    priceValue: 340,
    image: "/assets/categories/straps.jpg",
    imageAlt: "PULSE modular straps and bands trio set",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-ocean-loop-strap",
    slug: "pulse-ocean-loop-strap",
    name: "Fluoroelastomer Ocean Loop",
    category: "straps",
    categoryLabel: "STRAPS & BANDS",
    descriptor: "Deep Ocean Blue Flexible Ribbed Polymer with Corrosion-Proof Titanium Buckle",
    material: "Fluoroelastomer",
    price: "$140",
    priceValue: 140,
    image: "/assets/products/ocean-loop.jpg",
    imageAlt: "PULSE Fluoroelastomer Ocean Loop strap in deep blue",
    availability: "In Stock",
    featured: false,
    isNew: true,
  },
  {
    id: "pulse-ballistic-band",
    slug: "pulse-ballistic-band",
    name: "Woven Ballistic Tactical Band",
    category: "straps",
    categoryLabel: "STRAPS & BANDS",
    descriptor: "Military-Grade High-Tensile Dual-Weave Nylon with Matte Black Hardware",
    material: "Ballistic Nylon & Titanium",
    price: "$120",
    priceValue: 120,
    image: "/assets/products/ballistic-band.jpg",
    imageAlt: "PULSE woven ballistic tactical band in olive and charcoal",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-titanium-bracelet-strap",
    slug: "pulse-titanium-bracelet-strap",
    name: "Grade-5 Titanium Link Bracelet",
    category: "straps",
    categoryLabel: "STRAPS & BANDS",
    descriptor: "Satin-Brushed Ergonomic Titanium Links with Butterfly Deployant Clasp",
    material: "Grade-5 Titanium",
    price: "$320",
    priceValue: 320,
    image: "/assets/products/titanium-bracelet.jpg",
    imageAlt: "PULSE Grade-5 titanium metal link bracelet",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-leather-strap",
    slug: "pulse-leather-strap",
    name: "Saddle Brown Leather Strap",
    category: "straps",
    categoryLabel: "STRAPS & BANDS",
    descriptor: "Handcrafted Full-Grain Italian Bridle Leather with Contrast Cream Stitching",
    material: "Italian Bridle Leather",
    price: "$160",
    priceValue: 160,
    image: "/assets/products/leather-strap.jpg",
    imageAlt: "PULSE saddle brown handcrafted Italian leather strap",
    availability: "In Stock",
    featured: false,
  },

  // =========================================================================
  // 4. CHARGING & POWER (5 Products)
  // =========================================================================
  {
    id: "pulse-charging-dock",
    slug: "pulse-charging-dock",
    name: "Magnetic Charging Atelier Dock",
    category: "charging",
    categoryLabel: "CHARGING & POWER",
    descriptor: "High-Efficiency Inductive Wireless Charging Dock in Brushed Titanium & Ceramic",
    material: "Brushed Titanium & Ceramic",
    price: "$180",
    priceValue: 180,
    image: "/assets/categories/charging.jpg",
    imageAlt: "PULSE magnetic fast charging dock in brushed titanium and ceramic",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-travel-charger",
    slug: "pulse-travel-charger",
    name: "Dual-Device Travel Charging Mat",
    category: "charging",
    categoryLabel: "CHARGING & POWER",
    descriptor: "Ultra-Slim Foldable Magnetic Fast-Charging Pad for Timepiece and Audio",
    material: "Matte Silicone & Aluminum",
    price: "$220",
    priceValue: 220,
    image: "/assets/products/travel-charger.jpg",
    imageAlt: "PULSE dual-device foldable travel wireless charging mat",
    availability: "In Stock",
    featured: false,
    isNew: true,
  },
  {
    id: "pulse-charging-cable-puck",
    slug: "pulse-charging-cable-puck",
    name: "Titanium Magnetic Cable Puck",
    category: "charging",
    categoryLabel: "CHARGING & POWER",
    descriptor: "2-Meter Reinforced Braided Kevlar Cable with Solid Titanium Magnetic Puck",
    material: "Titanium & Braided Kevlar",
    price: "$95",
    priceValue: 95,
    image: "/assets/products/charging-cable.jpg",
    imageAlt: "PULSE 2m braided fast charging cable with titanium puck",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-power-stand",
    slug: "pulse-power-stand",
    name: "Modular Desktop Power Stand",
    category: "charging",
    categoryLabel: "CHARGING & POWER",
    descriptor: "Precision-Angled Architectural Aluminum Floating Display Charging Station",
    material: "Anodized Aerospace Aluminum",
    price: "$260",
    priceValue: 260,
    image: "/assets/products/power-stand.jpg",
    imageAlt: "PULSE modular desktop power stand in architectural aluminum",
    availability: "In Stock",
    featured: false,
  },
  {
    id: "pulse-charging-vault-case",
    slug: "pulse-charging-vault-case",
    name: "Travel Vault Charging Case",
    category: "charging",
    categoryLabel: "CHARGING & POWER",
    descriptor: "Anodized Aluminum Hard Shell Case with Built-in 10,000mAh Power Storage",
    material: "Hard-Anodized Aluminum",
    price: "$290",
    priceValue: 290,
    image: "/assets/products/charging-case.jpg",
    imageAlt: "PULSE travel vault battery charging hard shell case",
    availability: "In Stock",
    featured: false,
    isNew: true,
  },
];

export interface ShopFilterState {
  category: "all" | "popular" | "smartwatches" | "straps" | "editions" | "charging";
  material: string;
  priceRange: string;
  availability: string;
  popularOnly?: boolean;
}

export interface FilterFacetOption {
  id: string;
  label: string;
}

export const materialFilterOptions: FilterFacetOption[] = [
  { id: "all", label: "All Materials" },
  { id: "titanium", label: "Grade-5 & Marine Titanium" },
  { id: "ceramic", label: "Zirconia Ceramic" },
  { id: "carbon", label: "Forged Carbon & DLC" },
  { id: "straps", label: "Polymer, Nylon & Leather" },
  { id: "aluminum", label: "Aerospace Aluminum" },
];

export const priceFilterOptions: FilterFacetOption[] = [
  { id: "all", label: "All Prices" },
  { id: "under-500", label: "Under $500" },
  { id: "500-1000", label: "$500 – $1,000" },
  { id: "1000-1500", label: "$1,000 – $1,500" },
  { id: "above-1500", label: "$1,500+" },
];

export const availabilityFilterOptions: FilterFacetOption[] = [
  { id: "all", label: "All Availabilities" },
  { id: "in-stock", label: "In Stock" },
  { id: "limited", label: "Limited Allocation" },
];

export interface ShopPageContent {
  intro: {
    tag: string;
    headline: string;
    description: string;
  };
  sortOptions: { id: string; label: string }[];
}

export const shopPageContent: ShopPageContent = {
  intro: {
    tag: "THE PULSE COLLECTION",
    headline: "DISCOVER THE ATELIER CATALOGUE.",
    description:
      "Explore 20 precision-engineered timepieces, specialist expedition editions, modular straps, and precision power accessories crafted with Swiss horological integrity.",
  },
  sortOptions: [
    { id: "featured", label: "Featured" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "newest", label: "Newest" },
  ],
};

