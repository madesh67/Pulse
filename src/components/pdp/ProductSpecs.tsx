"use client";

import React from "react";
import { SpecCategory } from "../../lib/productDetailData";
import styles from "./ProductSpecs.module.scss";

interface ProductSpecsProps {
  specifications: SpecCategory[];
  productName: string;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({
  specifications,
  productName,
}) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <section className={styles.specsSection} aria-label={`${productName} Technical Specifications`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>03 / TECHNICAL SPECIFICATIONS</span>
        <h2 className={styles.sectionTitle}>Precision Horological & Technical Data</h2>
      </div>

      <div className={styles.specsGrid}>
        {specifications.map((cat, idx) => (
          <div key={idx} className={styles.specCategoryBlock}>
            <h3 className={styles.categoryTitle}>{cat.category}</h3>
            <dl className={styles.specList}>
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className={styles.specRow}>
                  <dt className={styles.specLabel}>{item.label}</dt>
                  <dd className={styles.specValue}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
};
