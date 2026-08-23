"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ShopProduct, shopProducts } from "../lib/shopProductsData";

interface WishlistContextType {
  items: ShopProduct[];
  addToWishlist: (product: ShopProduct) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (product: ShopProduct) => boolean; // returns true if added, false if removed
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "pulse_wishlist_v1";

// Initial mock wishlist items for immediate client engagement
const DEFAULT_INITIAL_WISHLIST: ShopProduct[] = [
  shopProducts[1], // PULSE Aurora Chrono
  shopProducts[5], // Modular Straps & Bands Trio
];

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShopProduct[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_INITIAL_WISHLIST;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addToWishlist = useCallback((product: ShopProduct) => {
    setItems((prev) => {
      if (prev.some((p) => p.slug === product.slug)) return prev;
      return [product, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const isInWishlist = useCallback(
    (slug: string) => {
      return items.some((p) => p.slug === slug);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (product: ShopProduct) => {
      const exists = items.some((p) => p.slug === product.slug);
      if (exists) {
        removeFromWishlist(product.slug);
        return false;
      } else {
        addToWishlist(product);
        return true;
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
