"use client";

import React from "react";
import { shopPageContent } from "../lib/shopProductsData";
import styles from "./ShopIntroduction.module.scss";

export const ShopIntroduction: React.FC = () => {
  const { tag, headline, description } = shopPageContent.intro;

  return (
    <section className={styles.introWrapper} aria-label="Shop Introduction">
      <div className={styles.container}>
        <div className={styles.introMeta}>
          <span className={styles.tagline}>{tag}</span>
        </div>
        <h1 className={styles.mainTitle}>{headline}</h1>
        <p className={styles.introDescription}>{description}</p>
      </div>
    </section>
  );
};
