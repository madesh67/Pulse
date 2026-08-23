"use client";

import React, { useRef } from "react";
import { SmartwatchCanvas, SmartwatchCanvasRef } from "./SmartwatchCanvas";
import { useWatchScrollAnimation } from "../hooks/useWatchScrollAnimation";
import { heroContent } from "../lib/heroContent";
import styles from "./WatchScrollScene.module.scss";

interface WatchScrollSceneProps {
  getFrameImage: (index: number) => HTMLImageElement | null;
  getFrameBgColor: (index: number) => string;
  totalFrames: number;
  scrollDistance?: string;
  initialFrame?: number;
}

export const WatchScrollScene: React.FC<WatchScrollSceneProps> = ({
  getFrameImage,
  getFrameBgColor,
  totalFrames,
  scrollDistance = "550vh", // Fluid continuous scroll distance
  initialFrame = 0,
}) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<SmartwatchCanvasRef | null>(null);

  const { brand, productName, introHeadline, introSubheading, landmarks, ctaLabel } = heroContent.hero;

  // Bind the scroll-trigger pinning and frame scrubbing animation
  useWatchScrollAnimation({
    triggerRef,
    pinRef,
    canvasRef,
    totalFrames,
  });

  return (
    <div
      ref={triggerRef}
      style={{
        height: scrollDistance,
        position: "relative",
        width: "100%",
      }}
    >
      <div ref={pinRef} className={styles.pinWrapper}>
        {/* Centered Canvas Container with responsive horizontal offset capability */}
        <div className={`canvas-wrapper-translate ${styles.canvasWrapper}`}>
          <SmartwatchCanvas
            ref={canvasRef}
            getFrameImage={getFrameImage}
            getFrameBgColor={getFrameBgColor}
            totalFrames={totalFrames}
            initialFrame={initialFrame}
          />
        </div>

        {/* 1. Hero Introduction Screen Overlay */}
        <div className={`hero-intro ${styles.introOverlay}`}>
          <div className={styles.introTop}>
            <span className={styles.introBrand}>{brand}</span>
            <h1 className={styles.introTitle}>{productName}</h1>
            <h2 className={styles.introHeadline}>{introHeadline}</h2>
          </div>
          <div className={styles.introBottom}>
            <p className={styles.introSubheading}>{introSubheading}</p>
          </div>
        </div>

        {/* Display Feature Overlay (Scene 2) */}
        <div className={`display-feature ${styles.displayOverlay} ${styles.leftFeature}`}>
          <div className={styles.displayTop}>
            <span className={styles.featureLabel}>01 / DISPLAY</span>
            <h3 className={styles.featureTitle}>Brilliance in Every Pixel</h3>
            <h4 className={styles.featureHeadline}>Always-on LTPO OLED Retina</h4>
          </div>
          <div className={styles.displayBottom}>
            <p className={styles.featureDesc}>
              The always-on LTPO OLED Retina display delivers extraordinary
              clarity with 2000 nits peak outdoor brightness. A double-curved
              sapphire crystal with dual anti-reflective coatings renders every
              detail with paper-like precision.
            </p>
            <div className={styles.displaySpecs}>
              <div className={styles.specItem}>
                <span className={styles.specValue}>2000</span>
                <span className={styles.specLabel}>Nits Brightness</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specValue}>326</span>
                <span className={styles.specLabel}>PPI Density</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specValue}>LTPO</span>
                <span className={styles.specLabel}>OLED Panel</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specValue}>120Hz</span>
                <span className={styles.specLabel}>Refresh Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Editorial Feature 2 Callout (Right Side Controls: Crown, Power Button, Mic) */}
        <div className={`feature-2 ${styles.featureOverlay} ${styles.rightFeature} ${styles.controlsOverlay}`}>
          <div className={styles.featureTop}>
            <span className={styles.featureLabel}>{landmarks[2].label}</span>
            <h3 className={styles.featureTitle}>{landmarks[2].headline}</h3>
            <h4 className={styles.featureHeadline}>Knurled titanium & stepped haptics</h4>
          </div>
          <div className={styles.featureBottom}>
            <p className={styles.featureDesc}>{landmarks[2].description}</p>
            <div className={styles.controlsList}>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Rotary Crown</span>
                <span className={styles.controlDetail}>Knurled titanium with stepped mechanical haptics</span>
              </div>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Power Button</span>
                <span className={styles.controlDetail}>Instant wake, app switcher & customizable shortcuts</span>
              </div>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Beamforming Mic</span>
                <span className={styles.controlDetail}>Acoustic port for noise-isolated calls & voice commands</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Editorial Feature 3 Callout (Scene 4: Audio on Desktop, Strap on Mobile) */}
        <div className={`feature-3 ${styles.featureOverlay} ${styles.rightFeature} ${styles.strapOverlay}`}>
          <div className={styles.featureTop}>
            {/* Desktop: Audio & Return */}
            <span className={`${styles.featureLabel} ${styles.desktopOnly}`}>
              {landmarks[3].label}
            </span>
            <h3 className={`${styles.featureTitle} ${styles.desktopOnly}`}>
              {landmarks[3].headline}
            </h3>
            <h4 className={`${styles.featureHeadline} ${styles.desktopOnly}`}>
              Dual-cavity acoustic port
            </h4>

            {/* Mobile: Strap & Materiality */}
            <span className={`${styles.featureLabel} ${styles.mobileOnly}`}>
              04 / STRAP & MATERIALITY
            </span>
            <h3 className={`${styles.featureTitle} ${styles.mobileOnly}`}>
              {landmarks[4].headline}
            </h3>
            <h4 className={`${styles.featureHeadline} ${styles.mobileOnly}`}>
              Grade-5 titanium & fluoroelastomer
            </h4>
          </div>
          <div className={styles.featureBottom}>
            {/* Desktop Description */}
            <p className={`${styles.featureDesc} ${styles.desktopOnly}`}>
              {landmarks[3].description}
            </p>
            {/* Mobile Description */}
            <p className={`${styles.featureDesc} ${styles.mobileOnly}`}>
              {landmarks[4].description}
            </p>
            {/* Desktop Controls List */}
            <div className={`${styles.controlsList} ${styles.desktopOnly}`}>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>High-Output Speaker</span>
                <span className={styles.controlDetail}>
                  Dual-cavity acoustic port for crystal-clear audio, calls & alarms
                </span>
              </div>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Tactile Back Button</span>
                <span className={styles.controlDetail}>
                  Ergonomic quick-return key for fluid navigation & split laps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Editorial Feature 4 Callout (Scene 5: Strap on Desktop, Audio on Mobile) */}
        <div className={`feature-4 ${styles.featureOverlay} ${styles.rightFeature}`}>
          <div className={styles.featureTop}>
            {/* Desktop: Strap & Materiality */}
            <span className={`${styles.featureLabel} ${styles.desktopOnly}`}>
              {landmarks[4].label}
            </span>
            <h3 className={`${styles.featureTitle} ${styles.desktopOnly}`}>
              {landmarks[4].headline}
            </h3>
            <h4 className={`${styles.featureHeadline} ${styles.desktopOnly}`}>
              Grade-5 titanium & fluoroelastomer
            </h4>

            {/* Mobile: Audio & Return */}
            <span className={`${styles.featureLabel} ${styles.mobileOnly}`}>
              05 / AUDIO & RETURN
            </span>
            <h3 className={`${styles.featureTitle} ${styles.mobileOnly}`}>
              {landmarks[3].headline}
            </h3>
            <h4 className={`${styles.featureHeadline} ${styles.mobileOnly}`}>
              Dual-cavity acoustic port
            </h4>
          </div>
          <div className={styles.featureBottom}>
            {/* Desktop Description */}
            <p className={`${styles.featureDesc} ${styles.desktopOnly}`}>
              {landmarks[4].description}
            </p>
            {/* Mobile Description */}
            <p className={`${styles.featureDesc} ${styles.mobileOnly}`}>
              {landmarks[3].description}
            </p>

            {/* Desktop Controls List */}
            <div className={`${styles.controlsList} ${styles.desktopOnly}`}>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Fluoroelastomer Band</span>
                <span className={styles.controlDetail}>
                  High-density flexible polymer engineered for extreme stretch & sweat resistance
                </span>
              </div>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Titanium Hardware</span>
                <span className={styles.controlDetail}>
                  Corrosion-proof grade-5 titanium buckle & dual retention loops
                </span>
              </div>
              <div className={styles.controlItem}>
                <span className={styles.controlTitle}>Tubular Ribbed Geometry</span>
                <span className={styles.controlDetail}>
                  Breathable micro-channel design that wicks moisture during intense activity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Final CTA Screen Overlay (Reserve Experience) */}
        <div className={`hero-final ${styles.finalOverlay}`}>
          <div className={styles.finalTop}>
            <span className={styles.finalBrand}>{brand}</span>
            <h1 className={styles.finalTitle}>{productName}</h1>
          </div>
          <div className={styles.finalBottom}>
            <p className={styles.finalDesc}>{introHeadline}</p>
            <a href="#reserve" className={styles.reserveButton}>
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
