"use client";

import React from "react";
import Link from "next/link";
import styles from "./ProductBreadcrumb.module.scss";

interface ProductBreadcrumbProps {
  categoryLabel: string;
  productName: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  categoryLabel,
  productName,
}) => {
  return (
    <nav className={styles.breadcrumbNav} aria-label="Breadcrumb Navigation">
      <Link href="/shop" className={styles.backLink}>
        <span className={styles.backArrow} aria-hidden="true">
          &larr;
        </span>
        <span>BACK TO SHOP</span>
      </Link>

      <div className={styles.separator} aria-hidden="true">
        /
      </div>

      <span className={styles.categoryLabel}>{categoryLabel}</span>

      <div className={styles.separator} aria-hidden="true">
        /
      </div>

      <span className={styles.activeProduct} aria-current="page">
        {productName}
      </span>
    </nav>
  );
};
