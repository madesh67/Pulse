import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { PageTransitionProvider } from "../components/transition/PageTransitionProvider";
import "../styles/global.scss";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulse-horology.com"),
  title: "PULSE NOVA PRO | Precision-Engineered Luxury Smartwatch",
  description: "Experience the synergy of precision horology and modern intelligence. Crafted in grade-5 titanium, featuring real-time scroll animation showcase.",
  keywords: ["PULSE", "NOVA PRO", "smartwatch", "luxury watch", "precision engineering", "e-commerce watch", "wearable tech"],
  authors: [{ name: "PULSE Horology" }],
};

export const viewport: Viewport = {
  themeColor: "#f7f7f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`}>
      <body>
        <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </Suspense>
      </body>
    </html>
  );
}

