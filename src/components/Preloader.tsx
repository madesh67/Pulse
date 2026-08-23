"use client";

import React from "react";
import styles from "./Preloader.module.scss";

interface PreloaderProps {
  isVisible: boolean;
  progress?: number;
  loadedCount?: number;
  totalCount?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ isVisible, progress = 0 }) => {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      className={`${styles.preloaderOverlay} ${!isVisible ? styles.fadeOut : ""}`}
      aria-hidden={!isVisible}
      role="dialog"
      aria-label="Loading"
    >
      <div className={styles.preloaderContent}>
        {/* PULSE Logo */}
        <h1 className={styles.brandLogo}>PULSE</h1>

        {/* 0% to 100% Progress-Filling Wave */}
        <div className={styles.waveContainer} aria-hidden="true">
          {/* Base Unfilled Wave (0%) */}
          <svg className={styles.waveSvg} viewBox="0 0 200 36">
            <path
              className={styles.waveBase}
              d="M 0 18 L 60 18 L 72 4 L 84 32 L 96 6 L 108 24 L 116 18 L 200 18"
            />
          </svg>

          {/* Dynamic Black Fill Layer that fills from 0% to 100% as frames load */}
          <div
            className={styles.waveFillLayer}
            style={{ clipPath: `inset(0 ${100 - clampedProgress}% 0 0)` }}
          >
            <svg className={styles.waveSvg} viewBox="0 0 200 36">
              <path
                className={styles.waveFill}
                d="M 0 18 L 60 18 L 72 4 L 84 32 L 96 6 L 108 24 L 116 18 L 200 18"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
