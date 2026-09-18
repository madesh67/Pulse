import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { PageTransitionProvider } from "../components/transition/PageTransitionProvider";
import { CartProvider, WishlistProvider, AccountProvider } from "../context";
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
  title: {
    default: "PULSE | Luxury Smartwatch",
    template: "%s | PULSE",
  },
  description: "Experience the synergy of precision horology and modern intelligence. Crafted in grade-5 titanium, featuring real-time scroll animation showcase.",
  keywords: ["PULSE", "smartwatch", "luxury watch", "precision engineering", "e-commerce watch", "wearable tech"],
  authors: [{ name: "PULSE Horology" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
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
        <CartProvider>
          <WishlistProvider>
            <AccountProvider>
              <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
                <PageTransitionProvider>{children}</PageTransitionProvider>
              </Suspense>
            </AccountProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
