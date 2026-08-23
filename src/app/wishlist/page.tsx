import React from "react";
import type { Metadata } from "next";
import { WishlistPageClient } from "./WishlistPageClient";

export const metadata: Metadata = {
  title: "Saved Curations | PULSE Horology Atelier",
  description: "Review and manage your curated wishlist of PULSE precision timepieces and luxury horology accessories.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
