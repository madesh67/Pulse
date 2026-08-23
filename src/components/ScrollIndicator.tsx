"use client";

import React from "react";
import { heroContent } from "../lib/heroContent";
import styles from "./ScrollIndicator.module.scss";

export const ScrollIndicator: React.FC = () => {
  const { scrollCue } = heroContent.hero;

  return (
    <div className={`scroll-indicator ${styles.indicatorContainer}`}>
      <span className={styles.label}>{scrollCue}</span>
      <div className={styles.track}>
        <div className={styles.dot} />
      </div>
    </div>
  );
};
