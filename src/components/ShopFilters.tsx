"use client";

import React, { useState } from "react";
import {
  shopCategories,
  materialFilterOptions,
  priceFilterOptions,
  availabilityFilterOptions,
  shopPageContent,
  ShopFilterState,
} from "../lib/shopProductsData";
import styles from "./ShopFilters.module.scss";

interface ShopFiltersProps {
  filterState: ShopFilterState;
  onUpdateFilter: (key: keyof ShopFilterState, value: string) => void;
  onResetFilters: () => void;
  selectedSort: string;
  onSelectSort: (sortId: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  filterState,
  onUpdateFilter,
  onResetFilters,
  selectedSort,
  onSelectSort,
  filteredCount,
  totalCount,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { sortOptions } = shopPageContent;

  // Calculate active filter count (excluding default "all" values)
  const activeFilterCount = [
    filterState.material !== "all",
    filterState.priceRange !== "all",
    filterState.availability !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters =
    filterState.category !== "all" ||
    filterState.material !== "all" ||
    filterState.priceRange !== "all" ||
    filterState.availability !== "all";

  // Helper label getters for chips
  const activeMaterialLabel = materialFilterOptions.find(
    (o) => o.id === filterState.material
  )?.label;
  const activePriceLabel = priceFilterOptions.find(
    (o) => o.id === filterState.priceRange
  )?.label;
  const activeAvailabilityLabel = availabilityFilterOptions.find(
    (o) => o.id === filterState.availability
  )?.label;
  const activeCategoryLabel = shopCategories.find(
    (c) => c.id === filterState.category
  )?.label;

  return (
    <div
      className={`${styles.filtersWrapper} ${isDrawerOpen ? styles.drawerOpen : ""}`}
      aria-label="Shop catalog filters and navigation"
    >
      {/* 1. Main Sticky Controls Bar */}
      <div className={styles.mainBar}>
        {/* Category Quick Tabs */}
        <nav className={styles.categoryNav} aria-label="Product categories">
          {shopCategories.map((cat) => {
            const isActive = filterState.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryBtn} ${isActive ? styles.active : ""}`}
                onClick={() => onUpdateFilter("category", cat.id)}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Filters Toggle, Sort Dropdown & Product Count */}
        <div className={styles.rightControls}>
          <span className={styles.productCount}>
            {filteredCount === totalCount
              ? `${String(totalCount).padStart(2, "0")} ${totalCount === 1 ? "Product" : "Products"}`
              : `${String(filteredCount).padStart(2, "0")} of ${totalCount} Products`}
          </span>

          {/* Filter Drawer Toggle */}
          <button
            type="button"
            className={`${styles.filterToggleBtn} ${isDrawerOpen ? styles.activeToggle : ""}`}
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            aria-expanded={isDrawerOpen}
            aria-controls="shop-filter-drawer"
          >
            <svg
              className={styles.filterIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="8" cy="6" r="2" fill="currentColor" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="16" cy="12" r="2" fill="currentColor" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="10" cy="18" r="2" fill="currentColor" />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className={styles.badge} aria-label={`${activeFilterCount} active filters`}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className={styles.sortWrapper}>
            <label htmlFor="shop-sort-select" className={styles.sortLabel}>
              Sort:
            </label>
            <select
              id="shop-sort-select"
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className={styles.sortSelect}
              aria-label="Sort products"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Expandable Multi-Facet Filter Drawer */}
      {isDrawerOpen && (
        <div id="shop-filter-drawer" className={styles.drawer} role="region" aria-label="Filter facets">
          <div className={styles.drawerContainer}>
            <div className={styles.facetGrid}>
              {/* Facet 1: Category */}
              <div className={styles.facetColumn}>
                <h4 className={styles.facetTitle}>Category</h4>
                <div className={styles.optionList} role="radiogroup" aria-label="Filter by category">
                  {shopCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles.optionBtn} ${filterState.category === cat.id ? styles.selectedOption : ""}`}
                      onClick={() => onUpdateFilter("category", cat.id)}
                    >
                      <span>{cat.label}</span>
                      {filterState.category === cat.id && (
                        <span className={styles.checkIndicator}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facet 2: Material & Casing */}
              <div className={styles.facetColumn}>
                <h4 className={styles.facetTitle}>Material & Case</h4>
                <div className={styles.optionList} role="radiogroup" aria-label="Filter by material">
                  {materialFilterOptions.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      className={`${styles.optionBtn} ${filterState.material === mat.id ? styles.selectedOption : ""}`}
                      onClick={() => onUpdateFilter("material", mat.id)}
                    >
                      <span>{mat.label}</span>
                      {filterState.material === mat.id && (
                        <span className={styles.checkIndicator}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facet 3: Price Bracket */}
              <div className={styles.facetColumn}>
                <h4 className={styles.facetTitle}>Price Range</h4>
                <div className={styles.optionList} role="radiogroup" aria-label="Filter by price range">
                  {priceFilterOptions.map((price) => (
                    <button
                      key={price.id}
                      type="button"
                      className={`${styles.optionBtn} ${filterState.priceRange === price.id ? styles.selectedOption : ""}`}
                      onClick={() => onUpdateFilter("priceRange", price.id)}
                    >
                      <span>{price.label}</span>
                      {filterState.priceRange === price.id && (
                        <span className={styles.checkIndicator}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facet 4: Availability */}
              <div className={styles.facetColumn}>
                <h4 className={styles.facetTitle}>Availability</h4>
                <div className={styles.optionList} role="radiogroup" aria-label="Filter by availability">
                  {availabilityFilterOptions.map((avail) => (
                    <button
                      key={avail.id}
                      type="button"
                      className={`${styles.optionBtn} ${filterState.availability === avail.id ? styles.selectedOption : ""}`}
                      onClick={() => onUpdateFilter("availability", avail.id)}
                    >
                      <span>{avail.label}</span>
                      {filterState.availability === avail.id && (
                        <span className={styles.checkIndicator}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={onResetFilters}
                className={styles.resetBtn}
              >
                Reset All Filters
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className={styles.applyBtn}
              >
                Show {filteredCount} {filteredCount === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Active Filters Chips Bar */}
      {hasActiveFilters && (
        <div className={styles.chipsBar} aria-label="Applied filters">
          <span className={styles.chipLabel}>Active:</span>

          {filterState.category !== "all" && (
            <div className={styles.chip}>
              <span>Category: {activeCategoryLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("category", "all")}
                className={styles.chipRemoveBtn}
                aria-label={`Remove category filter ${activeCategoryLabel}`}
              >
                ✕
              </button>
            </div>
          )}

          {filterState.material !== "all" && (
            <div className={styles.chip}>
              <span>Material: {activeMaterialLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("material", "all")}
                className={styles.chipRemoveBtn}
                aria-label={`Remove material filter ${activeMaterialLabel}`}
              >
                ✕
              </button>
            </div>
          )}

          {filterState.priceRange !== "all" && (
            <div className={styles.chip}>
              <span>Price: {activePriceLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("priceRange", "all")}
                className={styles.chipRemoveBtn}
                aria-label={`Remove price filter ${activePriceLabel}`}
              >
                ✕
              </button>
            </div>
          )}

          {filterState.availability !== "all" && (
            <div className={styles.chip}>
              <span>Availability: {activeAvailabilityLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("availability", "all")}
                className={styles.chipRemoveBtn}
                aria-label={`Remove availability filter ${activeAvailabilityLabel}`}
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className={styles.clearAllChipsBtn}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
export default ShopFilters;
