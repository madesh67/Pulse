// Centralized content configuration for Section 04 — First-Time Buyer Offer Banner
export interface OfferBannerContent {
  sectionId: string;
  sectionIndex: string;
  sectionTag: string;
  badge: string;
  headline: string;
  introCopy: string;
  watchName: string;
  watchSubtitle: string;
  originalPrice: string;
  offerPrice: string;
  discountPercentage: string;
  promoCode: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  guarantees: string[];
  specs: { label: string; value: string }[];
}

export const offerBannerContent: OfferBannerContent = {
  sectionId: "offer",
  sectionIndex: "04",
  sectionTag: "CLIENT PRIVILEGE",
  badge: "FIRST-TIME BUYER EXCLUSIVE",
  headline: "INAUGURAL ACQUISITION PRIVILEGE.",
  introCopy:
    "An invitation extended exclusively to first-time patrons of the PULSE horological maison. Experience Swiss mechanical architecture fused with intelligent chronometry.",
  watchName: "PULSE Aurora Chrono",
  watchSubtitle: "Edition 01 — Satin Aerospace Titanium",
  originalPrice: "$1,250",
  offerPrice: "$950",
  discountPercentage: "SAVE $300",
  promoCode: "FIRSTPULSE",
  ctaText: "CLAIM INAUGURAL PRIVILEGE",
  ctaHref: "#reserve",
  image: "/assets/offers/first-time-offer.png",
  imageAlt: "PULSE Aurora Chrono smartwatch with skeletonized dial standing upright",
  guarantees: [
    "Complimentary Bespoke Titanium Link Bracelet",
    "5-Year International Atelier Warranty",
    "Carbon-Neutral Priority Global Shipping",
    "30-Day Complimentary Trial & Return",
  ],
  specs: [
    { label: "Case Material", value: "Grade-5 Titanium" },
    { label: "Movement", value: "Hybrid Haptic Horology" },
    { label: "Glass", value: "Double Curved Sapphire" },
    { label: "Water Resistance", value: "10 ATM / 100M" },
  ],
};
