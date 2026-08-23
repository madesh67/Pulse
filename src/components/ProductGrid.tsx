"use client";

import React from "react";
import { ShopProduct } from "../lib/shopProductsData";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.scss";

interface ProductGridProps {
  products: ShopProduct[];
  onClearFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onClearFilters }) => {
  if (products.length === 0) {
    return (
      <section className={styles.gridSection} aria-label="Product Catalogue">
        <div className={styles.container}>
          <div className={styles.emptyState} role="status">
            <h2 className={styles.emptyTitle}>NO PRODUCTS FOUND</h2>
            <p className={styles.emptyDesc}>
              No timepieces or accessories match your currently selected criteria.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className={styles.clearFilterBtn}
            >
              CLEAR FILTERS
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gridSection} aria-label="Product Catalogue">
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
