"use client";

import React from "react";
import { shopCategories, shopPageContent } from "../lib/shopProductsData";
import styles from "./ShopControls.module.scss";

interface ShopControlsProps {
  selectedCategory: string;
  onSelectCategory: (catId: "all" | "popular" | "smartwatches" | "straps" | "editions" | "charging") => void;
  selectedSort: string;
  onSelectSort: (sortId: string) => void;
  filteredCount: number;
}

export const ShopControls: React.FC<ShopControlsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  filteredCount,
}) => {
  const { sortOptions } = shopPageContent;

  return (
    <div className={styles.controlsWrapper} aria-label="Catalog filters and sorting">
      <div className={styles.container}>
        {/* Category Navigation Tabs */}
        <nav className={styles.categoryNav} aria-label="Product categories">
          {shopCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                className={`${styles.categoryBtn} ${isActive ? styles.active : ""}`}
                onClick={() => onSelectCategory(category.id)}
                aria-pressed={isActive}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Count & Sort */}
        <div className={styles.rightControls}>
          <span className={styles.productCount}>
            {String(filteredCount).padStart(2, "0")} {filteredCount === 1 ? "Product" : "Products"}
          </span>

          <div className={styles.sortWrapper}>
            <label htmlFor="shop-sort" className={styles.sortLabel}>
              Sort:
            </label>
            <select
              id="shop-sort"
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className={styles.sortSelect}
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
