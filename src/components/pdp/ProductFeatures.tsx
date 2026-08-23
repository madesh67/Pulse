"use client";

import React from "react";
import { ProductFeature } from "../../lib/productDetailData";
import styles from "./ProductFeatures.module.scss";

interface ProductFeaturesProps {
  features: ProductFeature[];
  productName: string;
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({
  features,
  productName,
}) => {
  if (!features || features.length === 0) return null;

  return (
    <section className={styles.featuresSection} aria-label={`${productName} Key Features`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>02 / ENGINEERING HIGHLIGHTS</span>
        <h2 className={styles.sectionTitle}>Key Characteristics & Architecture</h2>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feat) => (
          <article key={feat.index} className={styles.featureCard}>
            <div className={styles.indexBadge}>{feat.index}</div>
            <h3 className={styles.featureTitle}>{feat.title}</h3>
            <p className={styles.featureDesc}>{feat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
