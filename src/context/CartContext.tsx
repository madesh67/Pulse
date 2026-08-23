"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string; // unique item key: slug + variants string
  slug: string;
  name: string;
  price: number;
  image: string;
  material: string;
  categoryLabel: string;
  selectedVariants?: Record<string, string>;
  variantSummary?: string;
  quantity: number;
  availability: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  promoCode: string;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  taxAmount: number;
  shippingAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "pulse_cart_v1";

// Initial mock cart items to give the user an immediate rich luxury commerce experience
const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  {
    id: "pulse-nova-pro_satin-titanium_44mm_ocean-black",
    slug: "pulse-nova-pro",
    name: "PULSE Nova Pro",
    price: 1150,
    image: "/assets/products/pulse-nova-pro.png",
    material: "Grade-5 Titanium",
    categoryLabel: "SMARTWATCHES",
    selectedVariants: {
      finish: "satin-titanium",
      size: "44mm",
      strap: "ocean-black",
    },
    variantSummary: "Satin Titanium • 44 mm • Fluoroelastomer Ocean",
    quantity: 1,
    availability: "In Stock",
  },
  {
    id: "pulse-leather-strap",
    slug: "pulse-leather-strap",
    name: "Saddle Brown Leather Strap",
    price: 160,
    image: "/assets/products/leather-strap.jpg",
    material: "Italian Bridle Leather",
    categoryLabel: "STRAPS & BANDS",
    quantity: 1,
    availability: "In Stock",
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
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
    return DEFAULT_INITIAL_ITEMS;
  });
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Save to localStorage on state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  // Add Item to cart
  const addItem = useCallback((itemData: Omit<CartItem, "id">) => {
    const variantsKey = itemData.selectedVariants
      ? Object.entries(itemData.selectedVariants)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join("_")
      : "default";
    const itemId = `${itemData.slug}_${variantsKey}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === itemId);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + (itemData.quantity || 1),
        };
        return next;
      }
      return [...prev, { ...itemData, id: itemId, quantity: itemData.quantity || 1 }];
    });
  }, []);

  // Remove Item
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Update quantity with delta (+1 or -1)
  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  // Direct set quantity
  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  // Clear Cart
  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode("");
    setDiscountAmount(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Apply promo code logic
  const applyPromoCode = useCallback(
    (code: string) => {
      const sanitized = code.trim().toUpperCase();
      if (!sanitized) {
        return { success: false, message: "Please enter a valid promotion code." };
      }

      if (sanitized === "FIRSTPULSE") {
        setPromoCode("FIRSTPULSE");
        setDiscountAmount(300);
        return { success: true, message: "Inaugural Client Privilege applied (-$300)." };
      }

      if (sanitized === "ATELIER10" || sanitized === "PULSE10") {
        const sub = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        const calcDisc = Math.round(sub * 0.1);
        setPromoCode(sanitized);
        setDiscountAmount(calcDisc);
        return { success: true, message: `10% Atelier Patron Privilege applied (-$${calcDisc}).` };
      }

      return { success: false, message: "Invalid or expired promotion code." };
    },
    [items]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode("");
    setDiscountAmount(0);
  }, []);

  // Calculations
  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const shippingAmount = 0; // Complimentary Express Insured Courier for all orders
  const taxRate = 0.05; // 5% estimated VAT / sales tax
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(effectiveSubtotal * taxRate);
  const finalTotal = effectiveSubtotal + taxAmount + shippingAmount;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setQuantity,
        clearCart,
        totalCount,
        subtotal,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        taxAmount,
        shippingAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
