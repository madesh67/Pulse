import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "PULSE — Shop The Collection | Precision Smartwatches & Horology",
  description:
    "Explore the complete PULSE collection of aerospace-grade titanium smartwatches, specialist expedition editions, modular straps, and precision power accessories.",
  openGraph: {
    title: "PULSE — Shop The Collection",
    description:
      "Explore the complete PULSE collection of aerospace-grade titanium smartwatches, specialist expedition editions, and modular accessories.",
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
      <ShopPageClient />
    </Suspense>
  );
}
