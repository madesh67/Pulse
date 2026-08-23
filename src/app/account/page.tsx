import React from "react";
import type { Metadata } from "next";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "Patron Portal & Account | PULSE Horology Atelier",
  description: "Manage your registered PULSE timepieces, order allocations, 5-year warranty certificates, and private concierge privileges.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
