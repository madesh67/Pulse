"use client";

import React from "react";
import { ShopProduct } from "../lib/shopProductsData";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.scss";

interface ProductGridProps {
  products: ShopProduct[];
  onClearFilters: () => void;
  gridMode?: "2-col" | "1-col";
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onClearFilters,
  gridMode = "2-col",
}) => {
  if (products.length === 0) {
    return (
      <section className={styles.gridSection} aria-label="Product Catalogue">
        <div className={styles.container}>
          <div className={styles.emptyState} role="status">
            <div className={styles.emptyIconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>NO TIMEPIECES FOUND</h2>
            <p className={styles.emptyDesc}>
              No timepieces or curations matched your chosen search query and filter facets. Try adjusting your selections.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className={styles.clearFilterBtn}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gridSection} aria-label="Product Catalogue">
      <div className={styles.container}>
        <div
          className={`${styles.productGrid} ${
            gridMode === "1-col" ? styles.singleColMode : styles.twoColMode
          }`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} gridMode={gridMode} />
          ))}
        </div>
      </div>
    </section>
  );
};
