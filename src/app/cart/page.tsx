import React from "react";
import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Bag | PULSE Horology Atelier",
  description: "Review and finalize your allocation of PULSE precision-engineered smartwatches, handcrafted straps, and power stations.",
};

export default function CartPage() {
  return <CartPageClient />;
}
