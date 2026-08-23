"use client";

import React, { useState, useEffect } from "react";
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
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterState: ShopFilterState;
  onUpdateFilter: (key: keyof ShopFilterState, value: string) => void;
  onResetFilters: () => void;
  selectedSort: string;
  onSelectSort: (sortId: string) => void;
  filteredCount: number;
  totalCount: number;
  gridMode: "2-col" | "1-col";
  onToggleGridMode: () => void;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterState,
  onUpdateFilter,
  onResetFilters,
  selectedSort,
  onSelectSort,
  filteredCount,
  totalCount,
  gridMode,
  onToggleGridMode,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const { sortOptions } = shopPageContent;

  // Body scroll lock when mobile modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileModalOpen]);

  // Calculate active filter count (excluding default "all" values and search)
  const activeFacetCount = [
    filterState.material !== "all",
    filterState.priceRange !== "all",
    filterState.availability !== "all",
  ].filter(Boolean).length;

  const totalActiveFilterCount =
    activeFacetCount +
    (filterState.category !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const hasActiveFilters = totalActiveFilterCount > 0;

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
      {/* 1. Main Sticky Desktop & Mobile Controls Bar */}
      <div className={styles.mainBar}>
        {/* Category Carousel Navigation */}
        <div className={styles.categoryNavWrapper}>
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
                  <span>{cat.label}</span>
                  {cat.id !== "all" && (
                    <span className={styles.catCountBadge}>{cat.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls (Search, Sort, Filters Toggle, Grid Mode) */}
        <div className={styles.actionControls}>
          {/* Live Search Input */}
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search timepieces & accessories..."
              className={styles.searchInput}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className={styles.searchClearBtn}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className={styles.controlButtonsGroup}>
            {/* Desktop Filter Drawer Toggle */}
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
              <span className={styles.filterBtnLabel}>Filters</span>
              {activeFacetCount > 0 && (
                <span className={styles.badge} aria-label={`${activeFacetCount} active filters`}>
                  {activeFacetCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Modal Trigger Button */}
            <button
              type="button"
              className={styles.mobileFilterModalBtn}
              onClick={() => setIsMobileModalOpen(true)}
              aria-label="Open filter drawer"
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
              {totalActiveFilterCount > 0 && (
                <span className={styles.badge}>{totalActiveFilterCount}</span>
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

            {/* Mobile Grid Layout Switcher (2-Col Compact vs 1-Col Editorial) */}
            <button
              type="button"
              className={styles.gridModeToggle}
              onClick={onToggleGridMode}
              title={gridMode === "2-col" ? "Switch to 1-column view" : "Switch to 2-column grid"}
              aria-label={gridMode === "2-col" ? "Switch to 1-column view" : "Switch to 2-column grid"}
            >
              {gridMode === "2-col" ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.gridIcon} aria-hidden="true">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.gridIcon} aria-hidden="true">
                  <rect x="3" y="4" width="18" height="6" rx="1.5" />
                  <rect x="3" y="14" width="18" height="6" rx="1.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Expandable Desktop Filter Drawer */}
      {isDrawerOpen && (
        <div id="shop-filter-drawer" className={styles.desktopDrawer} role="region" aria-label="Filter facets">
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
                        <span className={styles.checkIndicator}>&#10003;</span>
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
                        <span className={styles.checkIndicator}>&#10003;</span>
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
                        <span className={styles.checkIndicator}>&#10003;</span>
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
                        <span className={styles.checkIndicator}>&#10003;</span>
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

      {/* 3. Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className={styles.chipsBar} aria-label="Active filters">
          <span className={styles.chipLabel}>Active Filters:</span>

          {searchQuery.trim() && (
            <div className={styles.chip}>
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className={styles.chipRemoveBtn}
                aria-label="Remove search filter"
              >
                &times;
              </button>
            </div>
          )}

          {filterState.category !== "all" && activeCategoryLabel && (
            <div className={styles.chip}>
              <span>Category: {activeCategoryLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("category", "all")}
                className={styles.chipRemoveBtn}
                aria-label="Remove category filter"
              >
                &times;
              </button>
            </div>
          )}

          {filterState.material !== "all" && activeMaterialLabel && (
            <div className={styles.chip}>
              <span>Material: {activeMaterialLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("material", "all")}
                className={styles.chipRemoveBtn}
                aria-label="Remove material filter"
              >
                &times;
              </button>
            </div>
          )}

          {filterState.priceRange !== "all" && activePriceLabel && (
            <div className={styles.chip}>
              <span>Price: {activePriceLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("priceRange", "all")}
                className={styles.chipRemoveBtn}
                aria-label="Remove price filter"
              >
                &times;
              </button>
            </div>
          )}

          {filterState.availability !== "all" && activeAvailabilityLabel && (
            <div className={styles.chip}>
              <span>Status: {activeAvailabilityLabel}</span>
              <button
                type="button"
                onClick={() => onUpdateFilter("availability", "all")}
                className={styles.chipRemoveBtn}
                aria-label="Remove availability filter"
              >
                &times;
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

      {/* 4. Complete Mobile Responsive Filter Bottom-Sheet / Modal */}
      {isMobileModalOpen && (
        <div
          className={styles.mobileModalBackdrop}
          onClick={() => setIsMobileModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Filter products dialog"
        >
          <div
            className={styles.mobileModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.mobileModalHeader}>
              <div className={styles.modalHeaderTitleGroup}>
                <h3 className={styles.mobileModalTitle}>Filter Timepieces</h3>
                <span className={styles.mobileModalSubtitle}>
                  {filteredCount} {filteredCount === 1 ? "Product" : "Products"} Available
                </span>
              </div>
              <button
                type="button"
                className={styles.mobileModalCloseBtn}
                onClick={() => setIsMobileModalOpen(false)}
                aria-label="Close filters dialog"
              >
                &times;
              </button>
            </div>

            {/* Modal Body with Touch-Friendly Options */}
            <div className={styles.mobileModalBody}>
              {/* Keyword Search in Modal */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Search Catalogue</h4>
                <div className={styles.mobileSearchWrapper}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name, material, edition..."
                    className={styles.mobileSearchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className={styles.mobileSearchClearBtn}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Facet: Categories */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Category</h4>
                <div className={styles.mobilePillGrid}>
                  {shopCategories.map((cat) => {
                    const isSelected = filterState.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`${styles.mobilePillBtn} ${isSelected ? styles.mobilePillActive : ""}`}
                        onClick={() => onUpdateFilter("category", cat.id)}
                      >
                        <span>{cat.label}</span>
                        <span className={styles.mobilePillCount}>({cat.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facet: Material & Case */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Material & Case Architecture</h4>
                <div className={styles.mobilePillGrid}>
                  {materialFilterOptions.map((mat) => {
                    const isSelected = filterState.material === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        className={`${styles.mobilePillBtn} ${isSelected ? styles.mobilePillActive : ""}`}
                        onClick={() => onUpdateFilter("material", mat.id)}
                      >
                        {mat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facet: Price Range */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Price Bracket</h4>
                <div className={styles.mobilePillGrid}>
                  {priceFilterOptions.map((price) => {
                    const isSelected = filterState.priceRange === price.id;
                    return (
                      <button
                        key={price.id}
                        type="button"
                        className={`${styles.mobilePillBtn} ${isSelected ? styles.mobilePillActive : ""}`}
                        onClick={() => onUpdateFilter("priceRange", price.id)}
                      >
                        {price.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facet: Allocation / Availability */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Allocation Status</h4>
                <div className={styles.mobilePillGrid}>
                  {availabilityFilterOptions.map((avail) => {
                    const isSelected = filterState.availability === avail.id;
                    return (
                      <button
                        key={avail.id}
                        type="button"
                        className={`${styles.mobilePillBtn} ${isSelected ? styles.mobilePillActive : ""}`}
                        onClick={() => onUpdateFilter("availability", avail.id)}
                      >
                        {avail.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facet: Sort Order */}
              <div className={styles.mobileFacetSection}>
                <h4 className={styles.mobileFacetTitle}>Sort Order</h4>
                <div className={styles.mobilePillGrid}>
                  {sortOptions.map((sort) => {
                    const isSelected = selectedSort === sort.id;
                    return (
                      <button
                        key={sort.id}
                        type="button"
                        className={`${styles.mobilePillBtn} ${isSelected ? styles.mobilePillActive : ""}`}
                        onClick={() => onSelectSort(sort.id)}
                      >
                        {sort.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Sticky Bottom Action Bar */}
            <div className={styles.mobileModalFooter}>
              <button
                type="button"
                className={styles.mobileModalResetBtn}
                onClick={onResetFilters}
              >
                Reset All
              </button>
              <button
                type="button"
                className={styles.mobileModalApplyBtn}
                onClick={() => setIsMobileModalOpen(false)}
              >
                Show {filteredCount} {filteredCount === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Floating Action Button */}
      <div className={styles.mobileFloatingBar}>
        <button
          type="button"
          className={styles.floatingFilterPill}
          onClick={() => setIsMobileModalOpen(true)}
          aria-label="Open filter menu"
        >
          <svg className={styles.floatingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle cx="8" cy="6" r="2" fill="currentColor" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="16" cy="12" r="2" fill="currentColor" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="10" cy="18" r="2" fill="currentColor" />
          </svg>
          <span>Filters</span>
          {totalActiveFilterCount > 0 && (
            <span className={styles.floatingBadge}>{totalActiveFilterCount}</span>
          )}
        </button>

        <div className={styles.floatingCount}>
          {filteredCount} of {totalCount}
        </div>
      </div>
    </div>
  );
};
