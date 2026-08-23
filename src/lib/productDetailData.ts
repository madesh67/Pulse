import { shopProducts, ShopProduct } from "./shopProductsData";

export interface ProductGalleryItem {
  id: string;
  src: string;
  alt: string;
  label: string;
}

export interface ProductVariantOption {
  id: string;
  label: string;
  sublabel?: string;
  colorHex?: string;
  priceDelta?: number;
  image?: string;
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  description?: string;
  options: ProductVariantOption[];
  defaultOptionId: string;
}

export interface ProductFeature {
  index: string;
  title: string;
  description: string;
  tagline?: string;
  image?: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecCategory {
  category: string;
  items: SpecItem[];
}

export interface ProductDetail extends ShopProduct {
  gallery: ProductGalleryItem[];
  shortStory: {
    headline: string;
    paragraph1: string;
    paragraph2?: string;
    quote?: string;
  };
  variantGroups?: ProductVariantGroup[];
  features: ProductFeature[];
  specifications: SpecCategory[];
  inTheBox: {
    item: string;
    detail: string;
  }[];
  services: {
    title: string;
    description: string;
  }[];
  relatedSlugs: string[];
}

export const productDetailsMap: Record<string, ProductDetail> = {
  // =========================================================================
  // 1. SMARTWATCHES
  // =========================================================================
  "pulse-nova-pro": {
    ...shopProducts[0],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/pulse-nova-pro.png",
        alt: "PULSE Nova Pro flagship smartwatch in satin-brushed grade-5 titanium with always-on display",
        label: "Front Elevation",
      },
      {
        id: "profile",
        src: "/assets/categories/smartwatches.jpg",
        alt: "PULSE Nova Pro profile view highlighting machined rotary crown and tactile detents",
        label: "Flank & Crown",
      },
      {
        id: "materials",
        src: "/assets/collections/titanium-heritage.jpg",
        alt: "PULSE Nova Pro casing showing brushed titanium luster and sapphire aperture",
        label: "Case Architecture",
      },
      {
        id: "strap",
        src: "/assets/categories/straps.jpg",
        alt: "PULSE Nova Pro with high-performance interchangeable strap system",
        label: "Strap Integration",
      },
    ],
    shortStory: {
      headline: "The Architecture of Silent Intelligence.",
      paragraph1:
        "Engineered from aerospace-grade 5 titanium, the PULSE Nova Pro represents the apex of horological precision and seamless digital intelligence. Every facet is diamond-milled to micrometer tolerances, delivering uncompromising strength at a fraction of steel's weight.",
      paragraph2:
        "Featuring an ultra-bright Always-On LTPO OLED display protected beneath custom-curved sapphire crystal, Nova Pro presents glanceable complications with zero ambient glare. The mechanical rotary crown provides physical stepped haptic feedback for eyes-free control.",
      quote: "A horological instrument conceived without compromise.",
    },
    variantGroups: [
      {
        id: "finish",
        name: "Case Finish",
        description: "Aerospace-grade titanium surface treatment",
        defaultOptionId: "satin-titanium",
        options: [
          {
            id: "satin-titanium",
            label: "Satin Titanium",
            sublabel: "Grade-5 Natural Brushed",
            colorHex: "#c8c8cc",
            priceDelta: 0,
          },
          {
            id: "graphite-dlc",
            label: "Graphite DLC",
            sublabel: "Diamond-Like Carbon Finish",
            colorHex: "#323236",
            priceDelta: 50,
          },
        ],
      },
      {
        id: "size",
        name: "Case Diameter",
        description: "Calibrated for wrist proportion and balance",
        defaultOptionId: "44mm",
        options: [
          { id: "44mm", label: "44 mm", sublabel: "Standard Proportional Fit", priceDelta: 0 },
          { id: "46mm", label: "46 mm", sublabel: "Extended Battery & Display", priceDelta: 60 },
        ],
      },
      {
        id: "strap",
        name: "Integrated Strap",
        description: "Interchangeable high-performance band",
        defaultOptionId: "ocean-black",
        options: [
          {
            id: "ocean-black",
            label: "Fluoroelastomer Ocean",
            sublabel: "Hypoallergenic Marine Polymer",
            colorHex: "#1c1c1e",
            priceDelta: 0,
          },
          {
            id: "ballistic-olive",
            label: "Woven Ballistic Tactical",
            sublabel: "Dual-Weave High-Tensile Nylon",
            colorHex: "#474d42",
            priceDelta: 40,
          },
          {
            id: "titanium-link",
            label: "Grade-5 Link Bracelet",
            sublabel: "Matching Brushed Deployant Links",
            colorHex: "#a8a8ae",
            priceDelta: 170,
          },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Grade-5 Titanium Monolith",
        description:
          "Machined from solid billets of Grade-5 Ti-6Al-4V titanium. The case delivers twice the tensile strength of stainless steel with hypoallergenic biocompatibility.",
      },
      {
        index: "02",
        title: "Always-On LTPO OLED Display",
        description:
          "Dynamic 1Hz–60Hz refresh rate matrix reaching 2,000 nits peak luminance. Shielded beneath double-domed synthetic sapphire crystal with dual anti-reflective coatings.",
      },
      {
        index: "03",
        title: "Rotary Crown & Acoustic Flank",
        description:
          "Knurled digital crown with magnetic stepped haptics, paired with studio-grade beamforming microphones and an ultra-linear speaker for crystal voice clarity.",
      },
      {
        index: "04",
        title: "Adaptive Biometric Engine",
        description:
          "High-precision multi-spectral optical sensor array tracking continuous ECG, blood oxygen saturation (SpO2), heart-rate variability, and skin temperature.",
      },
    ],
    specifications: [
      {
        category: "CASE & HARDWARE",
        items: [
          { label: "Case Material", value: "Grade-5 Titanium (Ti-6Al-4V)" },
          { label: "Crystal", value: "Double-domed Sapphire Crystal (9 Mohs hardness)" },
          { label: "Case Diameter", value: "44 mm / 46 mm options" },
          { label: "Case Thickness", value: "11.8 mm" },
          { label: "Weight", value: "48 grams (excluding strap)" },
          { label: "Water Resistance", value: "100 Meters / 10 ATM (ISO 22810 standard)" },
        ],
      },
      {
        category: "DISPLAY",
        items: [
          { label: "Panel Technology", value: "Flexible LTPO OLED Always-On Retina Display" },
          { label: "Resolution", value: "480 x 480 pixels (326 ppi)" },
          { label: "Peak Luminance", value: "2,000 nits peak / 1 nit minimum night ambient" },
          { label: "Glass Coating", value: "Oleophobic smudge-resistant & dual AR coating" },
        ],
      },
      {
        category: "SENSORS & INTELLIGENCE",
        items: [
          { label: "Biometric Array", value: "8-channel PPG optical sensor, Electrical ECG sensor" },
          { label: "Environmental", value: "Barometric altimeter, 3-axis compass, Ambient light sensor" },
          { label: "Motion Tracking", value: "High-g accelerometer, 3-axis precision gyroscope" },
          { label: "Haptic Engine", value: "PULSE Taptic Core with magnetic detent feedback" },
        ],
      },
      {
        category: "CONNECTIVITY & AUDIO",
        items: [
          { label: "Wireless", value: "Bluetooth 5.3 Low Energy, Wi-Fi 6 (802.11ax), NFC" },
          { label: "Positioning", value: "Dual-frequency L1/L5 GPS, GLONASS, Galileo, BeiDou" },
          { label: "Audio", value: "Ultra-linear dynamic speaker, Dual beamforming mic array" },
        ],
      },
      {
        category: "POWER & BATTERY",
        items: [
          { label: "Battery Chemistry", value: "High-density Lithium-Polymer 420 mAh" },
          { label: "Runtime", value: "Up to 48 hours regular / 84 hours low-power mode" },
          { label: "Charging", value: "Magnetic Inductive Fast Charge (0–80% in 38 minutes)" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Nova Pro Smartwatch", detail: "Grade-5 Titanium Casing" },
      { item: "Configured Premium Strap", detail: "With matching titanium hardware" },
      { item: "Magnetic Fast-Charging Puck", detail: "Braided 1.2M Kevlar cable with titanium disc" },
      { item: "Atelier Documentation", detail: "Quick start manual & certificate of authenticity" },
    ],
    services: [
      {
        title: "Complimentary Express Delivery",
        description: "Dispatched via insured priority courier within 24–48 hours.",
      },
      {
        title: "2-Year International Atelier Warranty",
        description: "Comprehensive coverage against manufacturing and material variances.",
      },
      {
        title: "30-Day Evaluation Period",
        description: "Return or exchange in original condition with zero restocking fee.",
      },
    ],
    relatedSlugs: ["pulse-titanium-heritage", "pulse-hydro-active", "pulse-charging-dock", "pulse-modular-straps-set"],
  },

  "pulse-aurora-chrono": {
    ...shopProducts[1],
    gallery: [
      {
        id: "hero",
        src: "/assets/offers/first-time-offer.png",
        alt: "PULSE Aurora Chrono edition smartwatch with skeletonized dial face",
        label: "Dial View",
      },
      {
        id: "case",
        src: "/assets/categories/smartwatches.jpg",
        alt: "PULSE Aurora Chrono satin titanium case profile",
        label: "Horological Case",
      },
      {
        id: "detail",
        src: "/assets/collections/titanium-heritage.jpg",
        alt: "PULSE Aurora Chrono bezel detail",
        label: "Bezel Texture",
      },
    ],
    shortStory: {
      headline: "Classical Chronometry Meets Precision Code.",
      paragraph1:
        "The PULSE Aurora Chrono is a horological study in balance, combining the aesthetic traditions of open-heart skeletonized chronographs with high-performance biometric telemetry.",
      paragraph2:
        "Constructed in satin aerospace titanium with a laser-etched tachymeter bezel, Aurora Chrono renders active sub-dials for split-second elapsed timing and ambient biometric readouts.",
    },
    variantGroups: [
      {
        id: "finish",
        name: "Case Finish",
        defaultOptionId: "satin-aero",
        options: [
          { id: "satin-aero", label: "Satin Aerospace Titanium", colorHex: "#c4c4c8", priceDelta: 0 },
          { id: "dark-titanium", label: "Dark Blasted Titanium", colorHex: "#4a4a50", priceDelta: 50 },
        ],
      },
      {
        id: "strap",
        name: "Strap Selection",
        defaultOptionId: "italian-leather",
        options: [
          { id: "italian-leather", label: "Perforated Calfskin", sublabel: "Saddle Brown Leather", priceDelta: 0 },
          { id: "titanium-mesh", label: "Titanium Milanese Mesh", sublabel: "Fine Mesh Clasp", priceDelta: 120 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Skeletonized Digital Calibre",
        description: "Dynamic virtual sub-dials rendered with 60fps mechanical chronometer physics and depth shading.",
      },
      {
        index: "02",
        title: "Aerospace Titanium Casing",
        description: "Machined from satin-brushed Grade-5 titanium with mirror-polished bevel edges.",
      },
      {
        index: "03",
        title: "Tachymeter Scale Bezel",
        description: "Circumferential ceramic tachymeter bezel calibrated for instant velocity measurement.",
      },
    ],
    specifications: [
      {
        category: "CASE & HARDWARE",
        items: [
          { label: "Case Material", value: "Satin Aerospace Titanium" },
          { label: "Bezel", value: "High-Tech Ceramic Tachymeter" },
          { label: "Diameter", value: "45 mm" },
          { label: "Water Resistance", value: "100 Meters / 10 ATM" },
        ],
      },
      {
        category: "DISPLAY & POWER",
        items: [
          { label: "Display", value: "Always-On LTPO OLED (1–60Hz)" },
          { label: "Glass", value: "Curved Sapphire Crystal" },
          { label: "Battery Life", value: "Up to 48 hours" },
          { label: "Charging", value: "Magnetic Fast Charge Dock" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Aurora Chrono Timepiece", detail: "Satin Aerospace Titanium" },
      { item: "Selected Horological Strap", detail: "With matching titanium deployant buckle" },
      { item: "Magnetic Atelier Fast Charger", detail: "Braided cable included" },
    ],
    services: [
      { title: "Insured Priority Courier", description: "Direct delivery with signature verification." },
      { title: "2-Year Atelier Warranty", description: "Full international protection." },
    ],
    relatedSlugs: ["pulse-nova-pro", "pulse-aviator-chrono", "pulse-titanium-heritage"],
  },

  "pulse-titanium-heritage": {
    ...shopProducts[2],
    gallery: [
      {
        id: "hero",
        src: "/assets/collections/titanium-heritage.jpg",
        alt: "PULSE Titanium Heritage smartwatch with integrated metal link bracelet",
        label: "Master View",
      },
      {
        id: "bracelet",
        src: "/assets/products/titanium-bracelet.jpg",
        alt: "PULSE Grade-5 titanium link bracelet with butterfly deployant clasp",
        label: "Link Bracelet Detail",
      },
      {
        id: "case",
        src: "/assets/categories/smartwatches.jpg",
        alt: "PULSE Titanium Heritage sculpted lugs and bezel",
        label: "Sculpted Lugs",
      },
    ],
    shortStory: {
      headline: "The Pure Horological Expression.",
      paragraph1:
        "Sculpted entirely from satin-brushed Grade-5 titanium, the Titanium Heritage pairs the flagship PULSE architecture with an integrated solid-link titanium bracelet.",
      paragraph2:
        "Every single link is individually articulated and chamfered, terminating in an invisible butterfly deployant clasp for exceptional ergonomic wrist drape.",
    },
    variantGroups: [
      {
        id: "size",
        name: "Case Size",
        defaultOptionId: "44mm",
        options: [
          { id: "44mm", label: "44 mm Case", priceDelta: 0 },
          { id: "46mm", label: "46 mm Case", priceDelta: 70 },
        ],
      },
      {
        id: "finish",
        name: "Titanium Texture",
        defaultOptionId: "satin-brushed",
        options: [
          { id: "satin-brushed", label: "Satin Brushed", colorHex: "#c0c0c6", priceDelta: 0 },
          { id: "matte-blasted", label: "Matte Micro-Blasted", colorHex: "#88888e", priceDelta: 40 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Integrated Solid Link Bracelet",
        description: "Precision-milled Grade-5 titanium links with zero flex and seamless butterfly deployant clasp.",
      },
      {
        index: "02",
        title: "Monolithic Ergonomics",
        description: "Curved case back contour seamlessly mates to the wrist for all-day horological comfort.",
      },
      {
        index: "03",
        title: "Sapphire Crystal Aperture",
        description: "Double-domed 9 Mohs sapphire crystal with dual anti-reflective internal coatings.",
      },
    ],
    specifications: [
      {
        category: "CASE & BRACELET",
        items: [
          { label: "Case Material", value: "Grade-5 Titanium (Ti-6Al-4V)" },
          { label: "Bracelet Material", value: "Full Solid Titanium Links with Butterfly Clasp" },
          { label: "Water Resistance", value: "100 Meters / 10 ATM" },
          { label: "Total Weight", value: "98 grams (with full link bracelet)" },
        ],
      },
      {
        category: "HARDWARE & DISPLAY",
        items: [
          { label: "Display", value: "1.4-inch LTPO OLED (480x480 px, 2000 nits)" },
          { label: "Sensors", value: "PPG Optical Heart Rate, SpO2, ECG, Altimeter" },
          { label: "Battery", value: "Up to 48 Hours Regular Usage" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Titanium Heritage Smartwatch", detail: "Grade-5 Titanium Casing" },
      { item: "Integrated Titanium Link Bracelet", detail: "Includes half-link sizing kit & pin tool" },
      { item: "Magnetic Atelier Fast-Charging Dock", detail: "With 1.5M braided USB-C cable" },
    ],
    services: [
      { title: "Complimentary Sizing & Setup", description: "Includes micro-adjustment link kit." },
      { title: "2-Year International Warranty", description: "Comprehensive atelier guarantee." },
    ],
    relatedSlugs: ["pulse-nova-pro", "pulse-titanium-bracelet-strap", "pulse-charging-dock"],
  },

  "pulse-hydro-active": {
    ...shopProducts[3],
    gallery: [
      {
        id: "hero",
        src: "/assets/collections/hydro-active.jpg",
        alt: "PULSE Hydro Active performance smartwatch with tubular fluoroelastomer ocean strap",
        label: "Master View",
      },
      {
        id: "strap",
        src: "/assets/products/ocean-loop.jpg",
        alt: "PULSE Fluoroelastomer Ocean Loop strap in deep blue",
        label: "Ocean Loop Strap",
      },
      {
        id: "water",
        src: "/assets/categories/smartwatches.jpg",
        alt: "PULSE Hydro Active marine titanium case detail",
        label: "Marine Titanium Case",
      },
    ],
    shortStory: {
      headline: "Engineered for Velocity & Aquatic Depths.",
      paragraph1:
        "Designed for open-water exploration and high-intensity athletics, PULSE Hydro Active pairs a reinforced marine-grade titanium chassis with a tubular fluoroelastomer ocean band.",
      paragraph2:
        "The tubular strap geometry flexes and expands over wet suits while shedding water instantly. Water-lock seals and depth sensors activate automatically upon submersion.",
    },
    variantGroups: [
      {
        id: "strap-color",
        name: "Ocean Strap Color",
        defaultOptionId: "ocean-blue",
        options: [
          { id: "ocean-blue", label: "Deep Abyss Blue", colorHex: "#1a3b5c", priceDelta: 0 },
          { id: "arctic-white", label: "Arctic White", colorHex: "#e8eaed", priceDelta: 0 },
          { id: "volcanic-orange", label: "Safety Orange", colorHex: "#d9531e", priceDelta: 0 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Marine-Grade Titanium",
        description: "Specialized alloy with elevated molybdenum for extreme resistance to saltwater pitting.",
      },
      {
        index: "02",
        title: "Tubular Ocean Band",
        description: "Molded fluoroelastomer with tubular geometry for maximum stretch, airflow, and zero water retention.",
      },
      {
        index: "03",
        title: "Automatic Depth & Water Lock",
        description: "Integrated depth gauge and water-clearing acoustic frequency burst upon surfacing.",
      },
    ],
    specifications: [
      {
        category: "AQUATIC & CASE",
        items: [
          { label: "Material", value: "Marine-Grade Titanium" },
          { label: "Water Rating", value: "100M Water Resistance (ISO 6425 tested)" },
          { label: "Depth Sensor", value: "Real-time depth gauge & dive timer accurate to ±0.3m" },
          { label: "Strap Material", value: "High-Stretch Fluoroelastomer with Titanium Buckle" },
        ],
      },
      {
        category: "PERFORMANCE & BATTERY",
        items: [
          { label: "Display", value: "High-Contrast OLED (2,000 nits underwater readability)" },
          { label: "GPS", value: "Dual-Frequency L1/L5 Multi-Band GPS" },
          { label: "Battery", value: "Up to 50 hours active tracking" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Hydro Active Timepiece", detail: "Marine Titanium Case" },
      { item: "Tubular Ocean Band", detail: "With titanium buckle and adjustable loop" },
      { item: "Magnetic Fast Charging Cable", detail: "Waterproof sealed connector" },
    ],
    services: [
      { title: "Complimentary Worldwide Courier", description: "Dispatched within 24–48 hours." },
      { title: "2-Year Aquatic Warranty", description: "Guaranteed water resistance coverage." },
    ],
    relatedSlugs: ["pulse-ocean-loop-strap", "pulse-deep-diver-1000m", "pulse-nova-pro"],
  },

  "pulse-monolith-ceramic": {
    ...shopProducts[4],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/monolith-ceramic.jpg",
        alt: "PULSE Monolith Ceramic smartwatch in mirror white zirconia",
        label: "Ceramic Monolith",
      },
      {
        id: "case",
        src: "/assets/categories/charging.jpg",
        alt: "PULSE Monolith Ceramic high-polish case surface",
        label: "Mirror Polishing",
      },
    ],
    shortStory: {
      headline: "Sintered Zirconia Ceramic Perfection.",
      paragraph1:
        "The PULSE Monolith Ceramic is forged from high-purity zirconia powder, sintered at 1,500°C for 60 hours and diamond-polished to a flawless mirror luster.",
      paragraph2:
        "With a surface hardness exceeding 1,500 Vickers, it remains impervious to scratches, hypoallergenic, and silky smooth against the skin.",
    },
    variantGroups: [
      {
        id: "ceramic-color",
        name: "Ceramic Finish",
        defaultOptionId: "mirror-white",
        options: [
          { id: "mirror-white", label: "Pure Mirror White", colorHex: "#f0f0f4", priceDelta: 0 },
          { id: "phantom-black", label: "Gloss Phantom Black", colorHex: "#141416", priceDelta: 60 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "1,500 Vickers Ceramic",
        description: "Diamond-polished zirconia ceramic case that never scratches or oxidizes.",
      },
      {
        index: "02",
        title: "Mirror Finish Bevels",
        description: "Over 48 hours of manual diamond paste buffing for liquid-smooth reflections.",
      },
    ],
    specifications: [
      {
        category: "CERAMIC & HARDWARE",
        items: [
          { label: "Case Material", value: "High-Purity Sintered Zirconia (ZrO2) Ceramic" },
          { label: "Hardness", value: "1,500 Vickers (Mohs 8.5)" },
          { label: "Water Resistance", value: "50 Meters / 5 ATM" },
          { label: "Display", value: "LTPO OLED with Double-Domed Sapphire" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Monolith Ceramic Timepiece", detail: "Sintered Zirconia Casing" },
      { item: "Fine Ceramic & Leather Strap", detail: "Matching ceramic hardware" },
      { item: "Magnetic Atelier Fast Charger", detail: "Braided cable" },
    ],
    services: [
      { title: "2-Year International Warranty", description: "Atelier ceramic protection guarantee." },
    ],
    relatedSlugs: ["pulse-nova-pro", "pulse-stealth-obsidian", "pulse-charging-dock"],
  },

  // =========================================================================
  // 2. SPECIALIST EDITIONS
  // =========================================================================
  "pulse-stealth-obsidian": {
    ...shopProducts[5],
    gallery: [
      {
        id: "hero",
        src: "/assets/collections/stealth-obsidian.jpg",
        alt: "PULSE Stealth Obsidian specialist smartwatch in matte black DLC finish",
        label: "Master View",
      },
      {
        id: "profile",
        src: "/assets/categories/editions.jpg",
        alt: "PULSE Stealth Obsidian matte black case profile",
        label: "DLC Coating Profile",
      },
      {
        id: "strap",
        src: "/assets/products/solar-tactical.jpg",
        alt: "PULSE Stealth Obsidian knurled detents and tactical strap",
        label: "Tactile Detents",
      },
    ],
    shortStory: {
      headline: "The Art of Tactical Invisibility.",
      paragraph1:
        "Treated with physical vapor deposition Diamond-Like Carbon (DLC), the Stealth Obsidian absorbs 99.4% of ambient light reflections for zero visual signature.",
      paragraph2:
        "The custom night matrix UI presents monochromatic luminescence calibrated to preserve natural night vision in low-light environments.",
    },
    variantGroups: [
      {
        id: "night-matrix",
        name: "Display Matrix Profile",
        defaultOptionId: "obsidian-red",
        options: [
          { id: "obsidian-red", label: "Aviation Red Matrix", colorHex: "#a82020", priceDelta: 0 },
          { id: "tactical-green", label: "Night Vision Green", colorHex: "#207a3c", priceDelta: 0 },
          { id: "monochrome-white", label: "Monochrome Minimal", colorHex: "#d0d0d4", priceDelta: 0 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Diamond-Like Carbon (DLC)",
        description: "Hardened carbon molecular matrix applied via vacuum PVD for extreme scratch resistance.",
      },
      {
        index: "02",
        title: "Night Vision HUD Matrix",
        description: "Sub-1 nit ultra-low luminance mode compatible with night-vision optics.",
      },
    ],
    specifications: [
      {
        category: "TACTICAL HARDWARE",
        items: [
          { label: "Case Finish", value: "Matte Black Diamond-Like Carbon (DLC) on Grade-5 Ti" },
          { label: "Coating Hardness", value: "3,000 Vickers (HV 0.05)" },
          { label: "Water Resistance", value: "100 Meters / 10 ATM" },
          { label: "Bezel", value: "Micro-Knurled DLC Titanium with Non-Reflective Coating" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Stealth Obsidian Timepiece", detail: "DLC Matte Black Titanium" },
      { item: "Matte Black Ballistic Tactical Band", detail: "DLC buckle" },
      { item: "Magnetic Fast Charging Puck", detail: "Black braided cable" },
    ],
    services: [
      { title: "2-Year Tactical Warranty", description: "Comprehensive DLC surface and hardware warranty." },
    ],
    relatedSlugs: ["pulse-solar-tactical", "pulse-alpine-expedition", "pulse-ballistic-band"],
  },

  "pulse-alpine-expedition": {
    ...shopProducts[6],
    gallery: [
      {
        id: "hero",
        src: "/assets/categories/editions.jpg",
        alt: "PULSE Alpine Expedition specialist timepiece with high-altitude altimeter",
        label: "Master View",
      },
      {
        id: "strap",
        src: "/assets/collections/alpine-expedition.jpg",
        alt: "PULSE Alpine Expedition with woven ballistic strap",
        label: "Expedition Casing",
      },
    ],
    shortStory: {
      headline: "High-Altitude Endurance Instrument.",
      paragraph1:
        "Engineered for mountaineering and polar expeditions, the Alpine Expedition features reinforced titanium casing, dual barometers, and high-tensile ballistic nylon.",
      paragraph2:
        "Tested from -30°C to +60°C operating conditions with real-time barometric storm alerts and elevation profiling.",
    },
    features: [
      {
        index: "01",
        title: "Dual Barometric Altimeter",
        description: "Twin pressure sensors calibrated to detect 10cm elevation differentials and storm fronts.",
      },
      {
        index: "02",
        title: "Sub-Zero Temperature Circuitry",
        description: "Insulated lithium battery chemistry functional down to -30°C.",
      },
    ],
    specifications: [
      {
        category: "EXPEDITION SPECS",
        items: [
          { label: "Case Material", value: "Reinforced Titanium & Forged Carbon" },
          { label: "Operating Temperature", value: "-30°C to +60°C (-22°F to 140°F)" },
          { label: "Water & Ingress", value: "100M Water Resistance & IP68 Dust Seal" },
          { label: "GPS Battery Mode", value: "Up to 70 hours continuous expedition tracking" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Alpine Expedition Timepiece", detail: "Reinforced Titanium" },
      { item: "High-Tensile Ballistic Nylon Band", detail: "With titanium buckle" },
      { item: "Magnetic Atelier Fast Charger", detail: "Braided cable" },
    ],
    services: [
      { title: "2-Year Alpine Warranty", description: "Extreme environment coverage." },
    ],
    relatedSlugs: ["pulse-stealth-obsidian", "pulse-ballistic-band", "pulse-nova-pro"],
  },

  "pulse-aviator-chrono": {
    ...shopProducts[7],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/aviator-chrono.jpg",
        alt: "PULSE Aviator Chronometer pilot timepiece with UTC dual timezone",
        label: "Master View",
      },
      {
        id: "leather",
        src: "/assets/products/leather-strap.jpg",
        alt: "PULSE Saddle Brown Italian leather strap",
        label: "Calfskin Strap",
      },
    ],
    shortStory: {
      headline: "Dual-Timezone Aviation Instrument.",
      paragraph1:
        "The PULSE Aviator Chronometer is crafted for intercontinental pilots and navigators, offering dual-timezone UTC tracking and a 24-hour rotatable bezel interface.",
    },
    features: [
      {
        index: "01",
        title: "Dual UTC Timezones",
        description: "Simultaneous dual-time matrix with automatic IATA airport code synchronization.",
      },
    ],
    specifications: [
      {
        category: "AVIATION SPECS",
        items: [
          { label: "Case Material", value: "Blasted Aerospace Titanium & Ceramic" },
          { label: "Bezel", value: "24-Hour UTC Dual-Timezone Ceramic" },
          { label: "Strap", value: "Full-Grain Italian Bridle Leather" },
          { label: "Water Resistance", value: "100 Meters / 10 ATM" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Aviator Chronometer", detail: "Titanium Case" },
      { item: "Italian Leather Strap", detail: "With titanium clasp" },
      { item: "Magnetic Atelier Fast Charger", detail: "Included" },
    ],
    services: [{ title: "2-Year Global Warranty", description: "Aviation precision guarantee." }],
    relatedSlugs: ["pulse-leather-strap", "pulse-aurora-chrono", "pulse-nova-pro"],
  },

  "pulse-deep-diver-1000m": {
    ...shopProducts[8],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/deep-diver.jpg",
        alt: "PULSE Deep Diver 1000M professional diving smartwatch",
        label: "Master View",
      },
      {
        id: "ocean",
        src: "/assets/collections/hydro-active.jpg",
        alt: "PULSE Hydro Active ocean strap",
        label: "Ocean Band View",
      },
    ],
    shortStory: {
      headline: "1,000-Meter Oceanic Abyss Rating.",
      paragraph1:
        "Engineered with an integrated automatic helium escape valve and a 4.5mm thick sapphire crystal, the Deep Diver 1000M is certified for saturation diving.",
    },
    features: [
      {
        index: "01",
        title: "Helium Escape Valve",
        description: "Automatic pressure equalization valve for commercial saturation diving chambers.",
      },
    ],
    specifications: [
      {
        category: "DIVING SPECS",
        items: [
          { label: "Water Resistance", value: "1,000 Meters / 100 ATM (ISO 6425 saturation certified)" },
          { label: "Crystal Thickness", value: "4.5 mm synthetic sapphire" },
          { label: "Case", value: "Marine-Grade Grade-5 Titanium" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Deep Diver 1000M Timepiece", detail: "Helium Valve Case" },
      { item: "Fluoroelastomer Diving Strap", detail: "Includes wetsuit extension link" },
      { item: "Magnetic Charging Puck", detail: "Included" },
    ],
    services: [{ title: "2-Year Saturation Dive Warranty", description: "1000M depth integrity guarantee." }],
    relatedSlugs: ["pulse-hydro-active", "pulse-ocean-loop-strap", "pulse-nova-pro"],
  },

  "pulse-solar-tactical": {
    ...shopProducts[9],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/solar-tactical.jpg",
        alt: "PULSE Solar Tactical rugged forged composite timepiece",
        label: "Master View",
      },
      {
        id: "stealth",
        src: "/assets/collections/stealth-obsidian.jpg",
        alt: "PULSE Stealth Obsidian matte black case detail",
        label: "Tactical Case Detail",
      },
    ],
    shortStory: {
      headline: "Solar-Assisted Power Harvesting.",
      paragraph1:
        "The PULSE Solar Tactical embeds a high-efficiency photovoltaic ring beneath the sapphire crystal, extending battery endurance continuously under direct sunlight.",
    },
    features: [
      {
        index: "01",
        title: "Photovoltaic Ring",
        description: "Harvests 3 hours of operational runtime for every 1 hour of outdoor sunlight exposure.",
      },
    ],
    specifications: [
      {
        category: "SOLAR & CASE",
        items: [
          { label: "Case Material", value: "Forged Carbon Composite & DLC Titanium" },
          { label: "Solar Cell", value: "PowerGlass Photovoltaic Ring Matrix" },
          { label: "Battery Life", value: "Unlimited in ambient solar mode / 80 days standalone" },
        ],
      },
    ],
    inTheBox: [
      { item: "PULSE Solar Tactical Timepiece", detail: "Forged Carbon Case" },
      { item: "Woven Ballistic Strap", detail: "Included" },
      { item: "Magnetic Fast Charger", detail: "Included" },
    ],
    services: [{ title: "2-Year Rugged Warranty", description: "Comprehensive hardware warranty." }],
    relatedSlugs: ["pulse-stealth-obsidian", "pulse-ballistic-band", "pulse-alpine-expedition"],
  },

  // =========================================================================
  // 3. STRAPS & BANDS
  // =========================================================================
  "pulse-modular-straps-set": {
    ...shopProducts[10],
    gallery: [
      {
        id: "hero",
        src: "/assets/categories/straps.jpg",
        alt: "PULSE modular straps and bands trio set",
        label: "Trio Set View",
      },
      {
        id: "ocean",
        src: "/assets/products/ocean-loop.jpg",
        alt: "PULSE Fluoroelastomer Ocean Loop strap",
        label: "Ocean Loop",
      },
      {
        id: "titanium",
        src: "/assets/products/titanium-bracelet.jpg",
        alt: "PULSE Grade-5 titanium metal link bracelet",
        label: "Titanium Bracelet",
      },
    ],
    shortStory: {
      headline: "The Complete Atelier Strap Wardrobe.",
      paragraph1:
        "The Modular Straps Trio equips your PULSE timepiece for every discipline: the Fluoroelastomer Ocean band for aquatic sport, the Woven Ballistic band for expeditions, and the Grade-5 Titanium link bracelet for formal occasions.",
    },
    variantGroups: [
      {
        id: "compatibility",
        name: "Timepiece Compatibility",
        defaultOptionId: "all-pulse-44-46",
        options: [
          { id: "all-pulse-44-46", label: "PULSE 44mm & 46mm Timepieces", priceDelta: 0 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Three Disciplines in One Set",
        description: "Includes Ocean Fluoroelastomer, Woven Ballistic Nylon, and Grade-5 Titanium Link Bracelet.",
      },
      {
        index: "02",
        title: "Quick-Release Lugs",
        description: "Patented push-button mechanism enables tool-free strap changes in seconds.",
      },
    ],
    specifications: [
      {
        category: "MATERIALS & SIZING",
        items: [
          { label: "Included Straps", value: "Fluoroelastomer (1), Ballistic Nylon (1), Titanium Link (1)" },
          { label: "Hardware", value: "Grade-5 Titanium Buckles & Deployant Clasp" },
          { label: "Lug Width", value: "22 mm Universal PULSE Quick-Release" },
          { label: "Wrist Circumference", value: "Fits 140 mm to 220 mm wrists" },
        ],
      },
    ],
    inTheBox: [
      { item: "Fluoroelastomer Ocean Band", detail: "Deep Ocean Blue with Titanium Buckle" },
      { item: "Woven Ballistic Tactical Band", detail: "Olive / Charcoal Dual-Weave" },
      { item: "Grade-5 Titanium Link Bracelet", detail: "Satin-Brushed with butterfly clasp" },
      { item: "Atelier Leather Travel Roll", detail: "Protective storage pouch" },
    ],
    services: [
      { title: "Complimentary Delivery", description: "Insured courier shipping." },
      { title: "2-Year Material Guarantee", description: "Full craftsmanship warranty." },
    ],
    relatedSlugs: ["pulse-nova-pro", "pulse-titanium-heritage", "pulse-ocean-loop-strap"],
  },

  "pulse-ocean-loop-strap": {
    ...shopProducts[11],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/ocean-loop.jpg",
        alt: "PULSE Fluoroelastomer Ocean Loop strap in deep blue",
        label: "Master View",
      },
      {
        id: "active",
        src: "/assets/collections/hydro-active.jpg",
        alt: "PULSE Hydro Active ocean strap on watch",
        label: "Installed View",
      },
    ],
    shortStory: {
      headline: "Flexible Tubular Marine Polymer.",
      paragraph1:
        "Molded from custom high-grade fluoroelastomer with tubular geometry, the Ocean Loop stretches comfortably over a wetsuit and sheds water instantaneously.",
    },
    variantGroups: [
      {
        id: "color",
        name: "Strap Color",
        defaultOptionId: "ocean-blue",
        options: [
          { id: "ocean-blue", label: "Abyss Blue", colorHex: "#1b3c59", priceDelta: 0 },
          { id: "matte-black", label: "Midnight Black", colorHex: "#1a1a1c", priceDelta: 0 },
          { id: "polar-white", label: "Polar White", colorHex: "#eceef0", priceDelta: 0 },
        ],
      },
    ],
    features: [
      {
        index: "01",
        title: "Tubular Marine Geometry",
        description: "Maximizes airflow, flexibility, and instant water drainage.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Material", value: "High-Performance Fluoroelastomer" },
          { label: "Buckle", value: "Corrosion-Proof Grade-5 Titanium" },
          { label: "Compatibility", value: "All 44mm and 46mm PULSE Smartwatches" },
        ],
      },
    ],
    inTheBox: [
      { item: "Fluoroelastomer Ocean Loop Strap", detail: "With titanium buckle" },
      { item: "Adjustable Titanium Loop Ring", detail: "For wetsuit security" },
    ],
    services: [{ title: "2-Year Warranty", description: "Hypoallergenic and material warranty." }],
    relatedSlugs: ["pulse-hydro-active", "pulse-modular-straps-set", "pulse-ballistic-band"],
  },

  "pulse-ballistic-band": {
    ...shopProducts[12],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/ballistic-band.jpg",
        alt: "PULSE woven ballistic tactical band in olive and charcoal",
        label: "Master View",
      },
    ],
    shortStory: {
      headline: "Military-Grade Dual-Weave Nylon.",
      paragraph1:
        "Woven from high-tensile 1000D ballistic nylon threads, this tactical band delivers unmatched tear resistance while remaining breathable in high-humidity climates.",
    },
    features: [
      {
        index: "01",
        title: "High-Tensile Dual Weave",
        description: "Abrasion-resistant 1000D ballistic nylon with reinforced edge binding.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Material", value: "1000D Woven Ballistic Nylon" },
          { label: "Hardware", value: "Matte Black PVD Titanium Buckle" },
          { label: "Compatibility", value: "All 44mm & 46mm PULSE Timepieces" },
        ],
      },
    ],
    inTheBox: [{ item: "Woven Ballistic Tactical Band", detail: "With PVD Titanium Buckle" }],
    services: [{ title: "2-Year Warranty", description: "Tear and hardware warranty." }],
    relatedSlugs: ["pulse-alpine-expedition", "pulse-stealth-obsidian", "pulse-ocean-loop-strap"],
  },

  "pulse-titanium-bracelet-strap": {
    ...shopProducts[13],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/titanium-bracelet.jpg",
        alt: "PULSE Grade-5 titanium metal link bracelet",
        label: "Master View",
      },
      {
        id: "watch",
        src: "/assets/collections/titanium-heritage.jpg",
        alt: "PULSE Titanium Heritage with link bracelet installed",
        label: "Installed on Watch",
      },
    ],
    shortStory: {
      headline: "Articulated Grade-5 Titanium Metalwork.",
      paragraph1:
        "Crafted with satin-brushed solid Grade-5 titanium links and an invisible butterfly deployant clasp, this bracelet represents the pinnacle of metal strap horology.",
    },
    features: [
      {
        index: "01",
        title: "Solid Grade-5 Titanium Links",
        description: "Zero stretch or play with hand-chamfered edge bevels.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Material", value: "Grade-5 Titanium (Ti-6Al-4V)" },
          { label: "Clasp", value: "Double Butterfly Deployant with Dual Pushers" },
          { label: "Sizing", value: "Includes 4 removable links & pin tool" },
        ],
      },
    ],
    inTheBox: [
      { item: "Grade-5 Titanium Link Bracelet", detail: "Full link set" },
      { item: "Precision Sizing Pin Tool", detail: "For link adjustment" },
    ],
    services: [{ title: "2-Year Metalwork Warranty", description: "Clasp and link integrity guarantee." }],
    relatedSlugs: ["pulse-titanium-heritage", "pulse-nova-pro", "pulse-modular-straps-set"],
  },

  "pulse-leather-strap": {
    ...shopProducts[14],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/leather-strap.jpg",
        alt: "PULSE saddle brown handcrafted Italian leather strap",
        label: "Master View",
      },
    ],
    shortStory: {
      headline: "Handcrafted Full-Grain Italian Bridle Leather.",
      paragraph1:
        "Tanned in Tuscany using traditional vegetable extracts, this full-grain bridle leather strap develops an exquisite rich patina uniquely tailored to your wear over time.",
    },
    features: [
      {
        index: "01",
        title: "Vegetable-Tanned Bridle Leather",
        description: "Full-grain Italian calfskin with hand-waxed cream edge stitching.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Leather Origin", value: "Tuscany, Italy (Vegetable Tanned)" },
          { label: "Lining", value: "Hypoallergenic Zermatt Calfskin" },
          { label: "Hardware", value: "Satin Titanium Tang Buckle" },
        ],
      },
    ],
    inTheBox: [{ item: "Saddle Brown Italian Leather Strap", detail: "With titanium buckle" }],
    services: [{ title: "2-Year Leather Craftsmanship Warranty", description: "Guaranteed stitch and leather integrity." }],
    relatedSlugs: ["pulse-aviator-chrono", "pulse-aurora-chrono", "pulse-modular-straps-set"],
  },

  // =========================================================================
  // 4. CHARGING & POWER
  // =========================================================================
  "pulse-charging-dock": {
    ...shopProducts[15],
    gallery: [
      {
        id: "hero",
        src: "/assets/categories/charging.jpg",
        alt: "PULSE magnetic fast charging dock in brushed titanium and ceramic",
        label: "Master View",
      },
      {
        id: "stand",
        src: "/assets/products/power-stand.jpg",
        alt: "PULSE modular desktop charging station",
        label: "Profile View",
      },
    ],
    shortStory: {
      headline: "Architectural Inductive Power Station.",
      paragraph1:
        "Machined from solid Grade-5 titanium and mirror-polished white ceramic, the Atelier Charging Dock elevates your timepiece into an elegant bedside clock during fast wireless charging.",
    },
    features: [
      {
        index: "01",
        title: "Magnetic Alignment",
        description: "Precision neodymium ring locks the timepiece instantly in place for optimal induction efficiency.",
      },
      {
        index: "02",
        title: "Thermal Dissipation Base",
        description: "Solid weighted titanium base wicks away thermal heat to accelerate 0–80% charging in 38 minutes.",
      },
    ],
    specifications: [
      {
        category: "POWER & DIMENSIONS",
        items: [
          { label: "Materials", value: "Grade-5 Titanium & Mirror Zirconia Ceramic" },
          { label: "Input Power", value: "USB-C Power Delivery (9V/2.22A, 20W)" },
          { label: "Wireless Output", value: "15W High-Efficiency Magnetic Inductive" },
          { label: "Weight", value: "320 grams (anti-slip weighted base)" },
        ],
      },
    ],
    inTheBox: [
      { item: "Magnetic Charging Atelier Dock", detail: "Titanium & Ceramic Base" },
      { item: "Braided Kevlar USB-C Cable (1.5M)", detail: "With titanium jacket connectors" },
      { item: "20W Compact Atelier Power Adapter", detail: "GaN Fast Charger" },
    ],
    services: [{ title: "2-Year Electronics Warranty", description: "Comprehensive charging electronics protection." }],
    relatedSlugs: ["pulse-nova-pro", "pulse-charging-cable-puck", "pulse-travel-charger"],
  },

  "pulse-travel-charger": {
    ...shopProducts[16],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/travel-charger.jpg",
        alt: "PULSE dual-device foldable travel wireless charging mat",
        label: "Master View",
      },
      {
        id: "dock",
        src: "/assets/categories/charging.jpg",
        alt: "PULSE charging dock context",
        label: "Context View",
      },
    ],
    shortStory: {
      headline: "Ultra-Slim Foldable Magnetic Fast-Charging Pad.",
      paragraph1:
        "Crafted from premium matte silicone and anodized aerospace aluminum, this dual-device pad folds flat into a palm-sized travel square while charging both your PULSE watch and phone simultaneously.",
    },
    features: [
      {
        index: "01",
        title: "Dual Fast-Charging Coils",
        description: "Simultaneous 15W smartphone and 10W smartwatch magnetic induction charging.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Materials", value: "Anodized Aluminum & Soft-Touch Matte Silicone" },
          { label: "Folded Dimensions", value: "82 mm x 82 mm x 12 mm" },
          { label: "Weight", value: "145 grams" },
        ],
      },
    ],
    inTheBox: [
      { item: "Dual-Device Travel Charging Mat", detail: "Foldable Design" },
      { item: "Braided USB-C Cable (1.2M)", detail: "Included" },
      { item: "Compact Travel Pouch", detail: "Included" },
    ],
    services: [{ title: "2-Year Warranty", description: "Full travel power warranty." }],
    relatedSlugs: ["pulse-charging-dock", "pulse-charging-vault-case", "pulse-nova-pro"],
  },

  "pulse-charging-cable-puck": {
    ...shopProducts[17],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/charging-cable.jpg",
        alt: "PULSE 2m braided fast charging cable with titanium puck",
        label: "Master View",
      },
    ],
    shortStory: {
      headline: "2-Meter Reinforced Braided Kevlar Cable.",
      paragraph1:
        "Engineered for extreme durability, this 2-meter fast-charging cable features a bulletproof Kevlar-reinforced braided exterior paired with a solid titanium magnetic charging disc.",
    },
    features: [
      {
        index: "01",
        title: "Solid Titanium Puck",
        description: "Milled titanium magnetic puck with heat dissipation casing.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Length", value: "2.0 Meters (6.6 Feet)" },
          { label: "Materials", value: "Grade-5 Titanium Puck & Braided Kevlar Sleeve" },
          { label: "Connector", value: "USB-C to Magnetic Inductive Disc" },
        ],
      },
    ],
    inTheBox: [{ item: "Titanium Magnetic Cable Puck (2M)", detail: "Braided Kevlar" }],
    services: [{ title: "Lifetime Cable Warranty", description: "Covers fraying and connector failure." }],
    relatedSlugs: ["pulse-charging-dock", "pulse-nova-pro", "pulse-travel-charger"],
  },

  "pulse-power-stand": {
    ...shopProducts[18],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/power-stand.jpg",
        alt: "PULSE modular desktop power stand in architectural aluminum",
        label: "Master View",
      },
    ],
    shortStory: {
      headline: "Precision-Angled Architectural Aluminum Stand.",
      paragraph1:
        "Constructed from a single block of bead-blasted aerospace aluminum, the Power Stand holds your PULSE watch at a 65° ergonomic viewing angle on your desk.",
    },
    features: [
      {
        index: "01",
        title: "65° Ergonomic Angle",
        description: "Optimal glance angle for desk display mode while charging.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Material", value: "Anodized Aerospace Aluminum" },
          { label: "Base", value: "High-friction micro-suction silicone foot" },
          { label: "Cable Channel", value: "Hidden routing canal for standard PULSE charging puck" },
        ],
      },
    ],
    inTheBox: [{ item: "Modular Desktop Power Stand", detail: "Anodized Aluminum" }],
    services: [{ title: "2-Year Warranty", description: "Structural hardware guarantee." }],
    relatedSlugs: ["pulse-charging-dock", "pulse-charging-cable-puck", "pulse-nova-pro"],
  },

  "pulse-charging-vault-case": {
    ...shopProducts[19],
    gallery: [
      {
        id: "hero",
        src: "/assets/products/charging-case.jpg",
        alt: "PULSE travel vault battery charging hard shell case",
        label: "Master View",
      },
    ],
    shortStory: {
      headline: "Hard Shell Case with 10,000mAh Power Reserve.",
      paragraph1:
        "The Travel Vault Case protects your timepiece inside a crushproof aluminum shell while its integrated 10,000mAh lithium battery recharges your watch up to 20 full times on the go.",
    },
    features: [
      {
        index: "01",
        title: "10,000mAh Power Bank Inside",
        description: "Recharges your PULSE watch up to 20 full cycles off-grid.",
      },
      {
        index: "02",
        title: "Crushproof Anodized Shell",
        description: "Milled aluminum casing with dense shock-absorbing microfiber interior.",
      },
    ],
    specifications: [
      {
        category: "SPECIFICATIONS",
        items: [
          { label: "Capacity", value: "10,000 mAh (37 Wh) Airline Approved" },
          { label: "Case Material", value: "Hard-Anodized Aerospace Aluminum" },
          { label: "Input / Output", value: "USB-C Power Delivery 20W in/out" },
        ],
      },
    ],
    inTheBox: [
      { item: "Travel Vault Charging Case", detail: "10,000mAh Battery Reserve" },
      { item: "Braided USB-C Cable (1.0M)", detail: "Included" },
    ],
    services: [{ title: "2-Year Battery & Hardware Warranty", description: "Guaranteed cell and shell integrity." }],
    relatedSlugs: ["pulse-travel-charger", "pulse-charging-dock", "pulse-nova-pro"],
  },
};

export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return productDetailsMap[slug];
}

export function getAllProductSlugs(): string[] {
  return shopProducts.map((p) => p.slug);
}
