// Centralized content configuration for Clean Modern Footer
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  brand: {
    name: string;
    description: string;
    socials: {
      platform: "facebook" | "twitter" | "linkedin" | "instagram";
      href: string;
      label: string;
    }[];
  };
  quickLinks: {
    title: string;
    links: FooterLink[];
  };
  services: {
    title: string;
    links: FooterLink[];
  };
  contact: {
    title: string;
    address: string;
    email: string;
    phone: string;
  };
  bottom: {
    copyright: string;
    legalLinks: FooterLink[];
  };
}

export const footerContent: FooterContent = {
  brand: {
    name: "PULSE",
    description:
      "Crafting intelligent horological timepieces in aerospace titanium. Harmonizing high-complication Swiss aesthetics with next-generation chronometry.",
    socials: [
      { platform: "facebook", href: "#", label: "PULSE on Facebook" },
      { platform: "twitter", href: "#", label: "PULSE on X" },
      { platform: "linkedin", href: "#", label: "PULSE on LinkedIn" },
      { platform: "instagram", href: "#", label: "PULSE on Instagram" },
    ],
  },
  quickLinks: {
    title: "Quick Links",
    links: [
      { label: "About Maison", href: "/about" },
      { label: "Nova Pro Flagship", href: "/#hero" },
      { label: "Shop Categories", href: "/shop" },
      { label: "Popular Collections", href: "/shop?filter=popular" },
      { label: "Reserve Timepiece", href: "/#reserve" },
      { label: "Craftsmanship", href: "/about#craftsmanship" },
    ],
  },
  services: {
    title: "Our Services",
    links: [
      { label: "5-Year Atelier Warranty", href: "#" },
      { label: "Boutique Appointment", href: "#" },
      { label: "Order Tracking & Dispatch", href: "#" },
      { label: "Restoration & Service", href: "#" },
      { label: "Strap Sizing Guide", href: "#" },
      { label: "Client Assistance", href: "#" },
    ],
  },
  contact: {
    title: "Contact Us",
    address: "Rue du Rhône 42, 1204 Geneva, Switzerland",
    email: "concierge@pulse-horology.com",
    phone: "+41 (22) 819-9000",
  },
  bottom: {
    copyright: `© ${new Date().getFullYear()} PULSE. All rights reserved.`,
    legalLinks: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Sitemap", href: "#" },
    ],
  },
};
