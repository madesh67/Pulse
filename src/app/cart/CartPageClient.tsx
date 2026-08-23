"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { ProductCard } from "../../components/ProductCard";
import { useCart, useWishlist } from "../../context";
import { shopProducts } from "../../lib/shopProductsData";
import styles from "./cart.module.scss";

export const CartPageClient: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    taxAmount,
    finalTotal,
    clearCart,
  } = useCart();

  const { addToWishlist } = useWishlist();

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; text: string } | null>(
    null
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    setPromoFeedback({ success: result.success, text: result.message });
    if (result.success) {
      setPromoInput("");
    }
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    const productMatch = shopProducts.find((p) => p.slug === item.slug);
    if (productMatch) {
      addToWishlist(productMatch);
    }
    removeItem(item.id);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      const generatedOrderId = `PLS-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderComplete(generatedOrderId);
      clearCart();
    }, 1200);
  };

  // Recommended products if empty
  const recommendedProducts = [shopProducts[0], shopProducts[1], shopProducts[14]];

  return (
    <div className={styles.cartPage}>
      {/* 1. Global Navigation */}
      <Navigation />

      {/* 2. Main Shopping Bag Content */}
      <main className={styles.mainContainer}>
        {/* Header & Breadcrumb */}
        <header className={styles.pageHeader}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <Link href="/shop">Atelier Boutique</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Shopping Bag</span>
          </nav>

          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Atelier Shopping Bag</h1>
            {totalCount > 0 && (
              <span className={styles.itemCountBadge}>
                {totalCount} {totalCount === 1 ? "Item" : "Items"} Allocated
              </span>
            )}
          </div>
        </header>

        {/* Order Completed Screen (Simulated Checkout) */}
        {orderComplete ? (
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconCircle} style={{ color: "#2e7d32" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>Atelier Allocation Confirmed</h2>
            <p className={styles.emptySubtitle}>
              Your acquisition has been registered under Order Reference{" "}
              <strong>#{orderComplete}</strong>. A confirmation digest and insured courier tracking
              telemetry have been dispatched to your patron profile.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <Link href="/account" className={styles.emptyCtaBtn}>
                View in Account Portal
              </Link>
              <Link
                href="/shop"
                className={styles.emptyCtaBtn}
                style={{ background: "#ffffff", color: "#111111", border: "1px solid rgba(0,0,0,0.15)" }}
              >
                Continue Exploring
              </Link>
            </div>
          </div>
        ) : items.length > 0 ? (
          /* Populated Cart Layout */
          <div className={styles.cartLayout}>
            {/* Left: Items List & Trust Guarantees */}
            <div className={styles.itemsSection}>
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <article key={item.id} className={styles.cartItemCard}>
                    {/* Thumbnail */}
                    <div className={styles.itemImageWrapper}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={160}
                        className={styles.itemImage}
                      />
                    </div>

                    {/* Details */}
                    <div className={styles.itemDetails}>
                      <span className={styles.itemCategory}>{item.categoryLabel}</span>
                      <Link href={`/shop/${item.slug}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      {item.variantSummary && (
                        <span className={styles.variantPill}>{item.variantSummary}</span>
                      )}
                      <span className={styles.itemPriceUnit}>
                        Unit: {formatCurrency(item.price)}
                      </span>

                      {/* Item Actions */}
                      <div className={styles.itemActionsRow}>
                        <div className={styles.quantityStepper} aria-label="Quantity selector">
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            &minus;
                          </button>
                          <span className={styles.stepValue}>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            &#43;
                          </button>
                        </div>

                        <div className={styles.actionLinksGroup}>
                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => handleMoveToWishlist(item)}
                          >
                            Move to Wishlist
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.removeBtn}`}
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className={styles.itemTotalColumn}>
                      <span className={styles.lineTotal}>{formatCurrency(lineTotal)}</span>
                    </div>
                  </article>
                );
              })}

              {/* Trust Guarantees Bar */}
              <div className={styles.cartTrustBar}>
                <div className={styles.trustItem}>
                  <svg
                    className={styles.trustIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className={styles.trustText}>
                    Complimentary priority insured global courier dispatch
                  </span>
                </div>
                <div className={styles.trustItem}>
                  <svg
                    className={styles.trustIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className={styles.trustText}>
                    5-Year International Atelier Certificate & Warranty
                  </span>
                </div>
                <div className={styles.trustItem}>
                  <svg
                    className={styles.trustIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  <span className={styles.trustText}>
                    30-Day complimentary trial with zero restocking fee
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Sticky Order Valuation Summary */}
            <aside className={styles.summaryWrapper}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryHeading}>Order Valuation</h2>

                {/* Subtotal */}
                <div className={styles.summaryRow}>
                  <span>Subtotal ({totalCount} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {/* Applied Discount */}
                {discountAmount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                    <span>Privilege Discount ({promoCode})</span>
                    <span>&minus;{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className={styles.summaryRow}>
                  <span>Insured Global Courier</span>
                  <span className={styles.freeBadge}>COMPLIMENTARY</span>
                </div>

                {/* Estimated Taxes & Duty */}
                <div className={styles.summaryRow}>
                  <span>Estimated Duty & Tax (5%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>

                {/* Promo Code Entry */}
                <div className={styles.promoSection}>
                  <form onSubmit={handleApplyPromo} className={styles.promoForm}>
                    <input
                      type="text"
                      className={styles.promoInput}
                      placeholder="Enter promo / privilege code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button type="submit" className={styles.promoApplyBtn}>
                      Apply
                    </button>
                  </form>

                  {promoFeedback && (
                    <p
                      className={`${styles.promoMessage} ${
                        promoFeedback.success ? styles.promoSuccess : styles.promoError
                      }`}
                    >
                      {promoFeedback.text}
                    </p>
                  )}

                  {promoCode && (
                    <div className={styles.appliedPromoBadge}>
                      <span>Code: {promoCode}</span>
                      <button
                        type="button"
                        className={styles.removePromoBtn}
                        onClick={removePromoCode}
                        aria-label="Remove promotion code"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className={styles.summaryTotalRow}>
                  <span className={styles.totalLabel}>Total Valuation</span>
                  <span className={styles.totalAmount}>{formatCurrency(finalTotal)}</span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  <span>{isCheckingOut ? "Connecting to Atelier..." : "Proceed to Checkout"}</span>
                  <span className={styles.btnIconCircle}>&rarr;</span>
                </button>

                {/* Express Checkout Options */}
                <div className={styles.expressCheckoutDivider}>
                  <span>Or Express Checkout</span>
                </div>

                <div className={styles.expressPayGrid}>
                  <button
                    type="button"
                    className={styles.expressPayBtn}
                    onClick={handleCheckout}
                  >
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    className={styles.expressPayBtn}
                    style={{ background: "#ffffff", color: "#111111", border: "1px solid #e0e0e0" }}
                    onClick={handleCheckout}
                  >
                    <span>Google Pay</span>
                  </button>
                </div>

                {/* Payment Badges */}
                <div className={styles.paymentBadgesRow}>
                  <span>256-Bit SSL Encrypted &bull; Direct Atelier Concierge</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Empty Bag State */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>Your Shopping Bag is Empty</h2>
            <p className={styles.emptySubtitle}>
              Explore our precision-engineered chronometers, custom modular straps, and bespoke
              power ateliers.
            </p>
            <Link href="/shop" className={styles.emptyCtaBtn}>
              Explore Boutique Collections &rarr;
            </Link>

            {/* Recommended Curations */}
            <section className={styles.recommendedSection}>
              <h3 className={styles.recommendedHeading}>Curated Atelier Highlights</h3>
              <div className={styles.recommendedGrid}>
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
