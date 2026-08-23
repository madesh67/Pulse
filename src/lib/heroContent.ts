// Content configuration for the Cinematic Hero Experience & Global Navigation
export const heroContent = {
  navigation: {
    logo: "PULSE",
    product: "", // Configurable product name (empty to display pure brand logo 'PULSE')
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Popular", href: "/shop?filter=popular" },
      { label: "About Us", href: "/about" },
    ],
  },
  hero: {
    brand: "PULSE",
    productName: "NOVA PRO",
    tagline: "Horology Redefined",
    introHeadline: "A study in time, materiality, and silent intelligence.",
    introSubheading: "Crafted in grade-5 titanium. PULSE Nova Pro harmonizes high-complication aesthetics with a seamless, responsive interface.",
    scrollCue: "Scroll to explore",
    ctaLabel: "RESERVE NOVA PRO",
    landmarks: [
      {
        id: "landmark-0",
        frame: 0,
        label: "01 / ORIGIN",
        headline: "Pure Geometry",
        description: "Seamlessly machined grade-5 titanium casing, designed to withstand the elements while remaining lighter than steel.",
      },
      {
        id: "landmark-16",
        frame: 16,
        label: "02 / STRUCTURE",
        headline: "Sculpted Form",
        description: "Precision-milled lugs flow organic lines directly into the integrated hypoallergenic strap, fitting the wrist like a second skin.",
      },
      {
        id: "landmark-controls",
        frame: 160, // output_0205.jpg (205 - 45 = 160)
        label: "03 / CONTROLS",
        headline: "Tactile Navigation & Voice",
        description: "The right flank integrates three dedicated hardware interfaces: a knurled rotary digital crown with stepped haptics, a tactile power & action button, and a studio-grade beamforming microphone for crystal-clear voice commands.",
      },
      {
        id: "landmark-audio",
        frame: 282,
        label: "04 / AUDIO & RETURN",
        headline: "Acoustics & Quick Action",
        description: "An ultra-linear high-output speaker delivers rich audio clarity and siren alerts, paired with an ergonomic tactile back button for instant menu return and rapid workout control.",
      },
      {
        id: "landmark-strap",
        frame: 380,
        label: "05 / STRAP & MATERIALITY",
        headline: "High-Performance Fluoroelastomer",
        description: "Engineered from ultra-durable, flexible fluoroelastomer with tubular geometry for maximum stretch and breathability. Paired with corrosion-proof grade-5 titanium buckle hardware, it provides sweat and saltwater resistance with zero skin irritation.",
      },
    ],
  },
};
