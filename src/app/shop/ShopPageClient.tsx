"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  shopProducts,
  ShopProduct,
  ShopFilterState,
} from "../../lib/shopProductsData";
import { Navigation } from "../../components/Navigation";
import { ShopIntroduction } from "../../components/ShopIntroduction";
import { ShopFilters } from "../../components/ShopFilters";
import { ProductGrid } from "../../components/ProductGrid";
import { Footer } from "../../components/Footer";
import styles from "./shop.module.scss";

const initialFilterState: ShopFilterState = {
  category: "all",
  material: "all",
  priceRange: "all",
  availability: "all",
};

export const ShopPageClient: React.FC = () => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [internalCategory, setInternalCategory] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<ShopFilterState>(initialFilterState);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [gridMode, setGridMode] = useState<"2-col" | "1-col">("2-col");

  // Effective category considers URL query parameter (?filter=popular) unless overridden by user
  const effectiveCategory = internalCategory !== null
    ? internalCategory
    : (filterParam === "popular" ? "popular" : filterState.category);

  const activeFilterState = useMemo<ShopFilterState>(() => ({
    ...filterState,
    category: effectiveCategory as ShopFilterState["category"],
  }), [filterState, effectiveCategory]);

  const handleUpdateFilter = (key: keyof ShopFilterState, value: string) => {
    if (key === "category") {
      setInternalCategory(value);
    }
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setInternalCategory("all");
    setFilterState(initialFilterState);
    setSearchQuery("");
  };

  const handleToggleGridMode = () => {
    setGridMode((prev) => (prev === "2-col" ? "1-col" : "2-col"));
  };

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result: ShopProduct[] = [...shopProducts];

    // 0. Keyword Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.descriptor.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // 1. Category / Popular Filter
    if (activeFilterState.category === "popular") {
      result = result.filter((p) => p.isPopular);
    } else if (activeFilterState.category !== "all") {
      result = result.filter((p) => p.category === activeFilterState.category);
    }

    // 2. Material Filter
    if (activeFilterState.material !== "all") {
      result = result.filter((p) => {
        const mat = p.material.toLowerCase();
        if (activeFilterState.material === "titanium") {
          return mat.includes("titanium");
        }
        if (activeFilterState.material === "ceramic") {
          return mat.includes("ceramic");
        }
        if (activeFilterState.material === "carbon") {
          return mat.includes("carbon") || mat.includes("dlc") || mat.includes("composite");
        }
        if (activeFilterState.material === "straps") {
          return (
            mat.includes("fluoroelastomer") ||
            mat.includes("leather") ||
            mat.includes("nylon") ||
            mat.includes("multi-material")
          );
        }
        if (activeFilterState.material === "aluminum") {
          return mat.includes("aluminum");
        }
        return true;
      });
    }

    // 3. Price Bracket Filter
    if (activeFilterState.priceRange !== "all") {
      result = result.filter((p) => {
        if (activeFilterState.priceRange === "under-500") {
          return p.priceValue < 500;
        }
        if (activeFilterState.priceRange === "500-1000") {
          return p.priceValue >= 500 && p.priceValue <= 1000;
        }
        if (activeFilterState.priceRange === "1000-1500") {
          return p.priceValue > 1000 && p.priceValue <= 1500;
        }
        if (activeFilterState.priceRange === "above-1500") {
          return p.priceValue > 1500;
        }
        return true;
      });
    }

    // 4. Availability Filter
    if (activeFilterState.availability !== "all") {
      result = result.filter((p) => {
        if (activeFilterState.availability === "in-stock") {
          return p.availability === "In Stock";
        }
        if (activeFilterState.availability === "limited") {
          return p.availability === "Limited Allocation";
        }
        return true;
      });
    }

    // 5. Sorting
    if (selectedSort === "price-asc") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (selectedSort === "newest") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // "featured" default
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [activeFilterState, searchQuery, selectedSort]);

  return (
    <div className={styles.shopWrapper}>
      {/* 1. Global Navigation Bar */}
      <Navigation />

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Editorial Introduction */}
        <ShopIntroduction />

        {/* Multi-Facet Filter Component */}
        <ShopFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterState={activeFilterState}
          onUpdateFilter={handleUpdateFilter}
          onResetFilters={handleResetFilters}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          filteredCount={filteredProducts.length}
          totalCount={shopProducts.length}
          gridMode={gridMode}
          onToggleGridMode={handleToggleGridMode}
        />

        {/* Responsive CSS Product Grid */}
        <ProductGrid
          products={filteredProducts}
          onClearFilters={handleResetFilters}
          gridMode={gridMode}
        />
      </main>

      {/* 3. Full-Width Black Maison Footer */}
      <Footer />
    </div>
  );
};

export default ShopPageClient;
