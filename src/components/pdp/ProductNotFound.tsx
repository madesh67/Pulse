"use client";

import React from "react";
import Link from "next/link";
import styles from "./ProductNotFound.module.scss";

export const ProductNotFound: React.FC = () => {
  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.contentCard}>
        <span className={styles.brandTag}>PULSE ATELIER</span>
        <h1 className={styles.title}>Product Not Found</h1>
        <p className={styles.description}>
          The requested timepiece or atelier accessory does not exist in our current active catalog or may have completed its allocation run.
        </p>
        <div className={styles.actions}>
          <Link href="/shop" className={styles.backButton}>
            <span>&larr; BACK TO SHOP CATALOGUE</span>
          </Link>
          <Link href="/" className={styles.homeButton}>
            <span>RETURN TO HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
