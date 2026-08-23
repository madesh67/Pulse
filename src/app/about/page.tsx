import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Maison PULSE — Where Horology Meets Silicon Intelligence",
  description:
    "Discover the story of PULSE. Engineered in Grade-5 aerospace titanium, designed with Swiss watchmaking discipline, and driven by silent, intelligent chronometry.",
  openGraph: {
    title: "About Maison PULSE — The Story & Craftsmanship",
    description:
      "Engineered in Grade-5 aerospace titanium. Discover the philosophy, craftsmanship, and engineering behind PULSE timepieces.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
      <AboutPageClient />
    </Suspense>
  );
}
