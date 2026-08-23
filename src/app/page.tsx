"use client";

import React from "react";
import { useFramePreloader } from "../hooks/useFramePreloader";
import { Preloader } from "../components/Preloader";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";
import { WatchScrollScene } from "../components/WatchScrollScene";
import { Navigation } from "../components/Navigation";
import { ShopByCategorySection } from "../components/ShopByCategorySection";
import { PopularCollections } from "../components/PopularCollections";
import { OfferBanner } from "../components/OfferBanner";
import { Footer } from "../components/Footer";
import styles from "./page.module.scss";

export default function Home() {
  const {
    progress,
    totalCount,
    isFullyLoaded,
    getFrameImage,
    getFrameBgColor,
  } = useFramePreloader();

  // The master website background is pure #ffffff
  const fixedBgColor = "#ffffff";

  // Support direct single-frame rendering if query param is set
  let forceFrame = 0;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const forceFrameParam = urlParams.get("frame");
    if (forceFrameParam !== null) {
      const parsed = parseInt(forceFrameParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalCount) {
        forceFrame = parsed;
      }
    }
  }

  return (
    <main
      className={styles.pageWrapper}
      style={{ backgroundColor: fixedBgColor, overflow: "visible", height: "auto" }}
    >
      {/* Minimal PULSE logo with progress-filling wave */}
      <Preloader isVisible={!isFullyLoaded} progress={progress} />

      {isFullyLoaded && (
        <SmoothScrollProvider>
          {/* Production Navigation Bar */}
          <Navigation />

          {/* Section 01 — Cinematic Scroll Scene with Pinned Watch Canvas */}
          <WatchScrollScene
            getFrameImage={getFrameImage}
            getFrameBgColor={getFrameBgColor}
            totalFrames={totalCount}
            initialFrame={forceFrame}
          />

          {/* Section 02 — Shop by Category (Product & Ecosystem Discovery) */}
          <ShopByCategorySection />

          {/* Section 03 — Popular Collections (Curated Collections Grid) */}
          <PopularCollections />

          {/* Section 04 — First-Time Buyer Offer Banner with 12-Hour Reset Timer */}
          <OfferBanner />

          {/* Section 05 — Maison Atelier Footer */}
          <Footer />
        </SmoothScrollProvider>
      )}
    </main>
  );
}
