"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface OrderItemSummary {
  name: string;
  variant: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ClientOrder {
  id: string;
  date: string;
  items: OrderItemSummary[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Delivered" | "In Transit" | "Assembling in Atelier";
  trackingNumber: string;
  carrier: string;
  shippingAddress: string;
  deliveryEstimate: string;
}

export interface RegisteredTimepiece {
  serialNumber: string;
  modelName: string;
  edition: string;
  registrationDate: string;
  warrantyExpiry: string;
  warrantyStatus: "Active" | "Lifetime Extended";
  calibrationStatus: string;
  image: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  street: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex" | "Apple Pay";
  last4: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberTier: string;
  memberSince: string;
  patronPoints: number;
  avatarInitials: string;
  isLoggedIn: boolean;
}

interface AccountContextType {
  user: UserProfile;
  orders: ClientOrder[];
  timepieces: RegisteredTimepiece[];
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
  registerTimepiece: (serial: string, model: string) => boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleLogin: () => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

const STORAGE_KEY = "pulse_account_v1";

const DEFAULT_USER: UserProfile = {
  name: "Julian Vane",
  email: "julian.vane@atelier-pulse.com",
  phone: "+1 (415) 890-2410",
  memberTier: "Atelier Haute Patron",
  memberSince: "2024",
  patronPoints: 14850,
  avatarInitials: "JV",
  isLoggedIn: true,
};

const DEFAULT_ORDERS: ClientOrder[] = [
  {
    id: "PLS-984210",
    date: "August 12, 2026",
    items: [
      {
        name: "PULSE Nova Pro",
        variant: "Satin Titanium • 44 mm • Ocean Black",
        price: 1150,
        image: "/assets/products/pulse-nova-pro.png",
        quantity: 1,
      },
    ],
    subtotal: 1150,
    tax: 58,
    total: 1208,
    status: "Delivered",
    trackingNumber: "FDX-882941094-US",
    carrier: "FedEx Priority Insured Courier",
    shippingAddress: "740 Montgomery St, Suite 400, San Francisco, CA 94111",
    deliveryEstimate: "Delivered on Aug 14, 2026 (Signature Verified)",
  },
  {
    id: "PLS-774019",
    date: "August 20, 2026",
    items: [
      {
        name: "Saddle Brown Leather Strap",
        variant: "Italian Bridle Leather • Titanium Tang",
        price: 160,
        image: "/assets/products/leather-strap.jpg",
        quantity: 1,
      },
      {
        name: "Dual-Device Travel Charging Mat",
        variant: "Charcoal Saffiano • Titanium Trim",
        price: 220,
        image: "/assets/products/travel-charger.jpg",
        quantity: 1,
      },
    ],
    subtotal: 380,
    tax: 19,
    total: 399,
    status: "In Transit",
    trackingNumber: "DHL-994821034-EX",
    carrier: "DHL Express Atelier Delivery",
    shippingAddress: "740 Montgomery St, Suite 400, San Francisco, CA 94111",
    deliveryEstimate: "Expected Tomorrow by 10:30 AM",
  },
];

const DEFAULT_TIMEPIECES: RegisteredTimepiece[] = [
  {
    serialNumber: "PLS-NP-2026-0849",
    modelName: "PULSE Nova Pro Flagship",
    edition: "Grade-5 Titanium Inaugural Edition",
    registrationDate: "August 14, 2026",
    warrantyExpiry: "August 14, 2031 (5-Year Active)",
    warrantyStatus: "Active",
    calibrationStatus: "Certified Chronometer Standard (\u00B10.5 s/day)",
    image: "/assets/products/pulse-nova-pro.png",
  },
];

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Primary Residence",
    name: "Julian Vane",
    street: "740 Montgomery St",
    suite: "Suite 400",
    city: "San Francisco",
    state: "CA",
    zip: "94111",
    country: "United States",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Design Atelier & Studio",
    name: "Julian Vane",
    street: "1055 Broadway",
    city: "New York",
    state: "NY",
    zip: "10010",
    country: "United States",
    isDefault: false,
  },
];

const DEFAULT_PAYMENTS: SavedPaymentMethod[] = [
  {
    id: "pay-1",
    brand: "Apple Pay",
    last4: "Apple Pay Express",
    expiry: "Connected",
    holderName: "Julian Vane",
    isDefault: true,
  },
  {
    id: "pay-2",
    brand: "Visa",
    last4: "8829",
    expiry: "09/29",
    holderName: "Julian Vane",
    isDefault: false,
  },
];

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.user) return parsed.user;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_USER;
  });

  const [orders] = useState<ClientOrder[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.orders) return parsed.orders;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_ORDERS;
  });

  const [timepieces, setTimepieces] = useState<RegisteredTimepiece[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.timepieces) return parsed.timepieces;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_TIMEPIECES;
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.addresses) return parsed.addresses;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_ADDRESSES;
  });

  const [paymentMethods] = useState<SavedPaymentMethod[]>(DEFAULT_PAYMENTS);

  // Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, orders, timepieces, addresses })
      );
    } catch {
      // Ignore
    }
  }, [user, orders, timepieces, addresses]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const addAddress = useCallback((addr: Omit<SavedAddress, "id">) => {
    const newId = `addr-${Date.now()}`;
    setAddresses((prev) => [
      ...prev.map((a) => (addr.isDefault ? { ...a, isDefault: false } : a)),
      { ...addr, id: newId },
    ]);
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const registerTimepiece = useCallback((serial: string, model: string) => {
    if (!serial.trim()) return false;
    const now = new Date();
    const expiryYear = now.getFullYear() + 5;
    const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const expiryStr = `${now.toLocaleDateString("en-US", { month: "long", day: "numeric" })}, ${expiryYear} (5-Year Active)`;

    const newTimepiece: RegisteredTimepiece = {
      serialNumber: serial.toUpperCase(),
      modelName: model || "PULSE Chronometer Instrument",
      edition: "Registered Atelier Ownership",
      registrationDate: dateStr,
      warrantyExpiry: expiryStr,
      warrantyStatus: "Active",
      calibrationStatus: "Factory Synchronized (\u00B10.5 s/day)",
      image: "/assets/products/pulse-nova-pro.png",
    };

    setTimepieces((prev) => [newTimepiece, ...prev]);
    return true;
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const finalName = name || email.split("@")[0] || "Patron";
    const initials = finalName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    setUser((prev) => ({
      ...prev,
      email,
      name: finalName,
      avatarInitials: initials || "AP",
      isLoggedIn: true,
    }));
  }, []);

  const logout = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  }, []);

  const toggleLogin = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: !prev.isLoggedIn,
    }));
  }, []);

  return (
    <AccountContext.Provider
      value={{
        user,
        orders,
        timepieces,
        addresses,
        paymentMethods,
        updateProfile,
        addAddress,
        removeAddress,
        registerTimepiece,
        login,
        logout,
        toggleLogin,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
