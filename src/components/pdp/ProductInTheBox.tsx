"use client";

import React from "react";
import styles from "./ProductInTheBox.module.scss";

interface InTheBoxItem {
  item: string;
  detail: string;
}

interface ProductInTheBoxProps {
  items: InTheBoxItem[];
  productName: string;
}

export const ProductInTheBox: React.FC<ProductInTheBoxProps> = ({
  items,
  productName,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.boxSection} aria-label={`What is included with ${productName}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>04 / PACKAGING & CONTENTS</span>
        <h2 className={styles.sectionTitle}>What Is In The Box</h2>
      </div>

      <div className={styles.boxGrid}>
        {items.map((entry, idx) => (
          <div key={idx} className={styles.boxItemCard}>
            <div className={styles.iconCircle}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.checkIcon}
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className={styles.itemText}>
              <span className={styles.itemTitle}>{entry.item}</span>
              <span className={styles.itemDetail}>{entry.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
