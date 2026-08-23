"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { ProductCard } from "../../components/ProductCard";
import { useWishlist, useCart } from "../../context";
import { shopProducts, ShopProduct } from "../../lib/shopProductsData";
import styles from "./wishlist.module.scss";

export const WishlistPageClient: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addItem } = useCart();

  const [toastMessage, setToastMessage] = useState<{ text: string; linkText?: string; linkHref?: string } | null>(
    null
  );
  const [addedItemSlugs, setAddedItemSlugs] = useState<Record<string, boolean>>({});

  const showToast = (text: string, linkText?: string, linkHref?: string) => {
    setToastMessage({ text, linkText, linkHref });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddToCart = (product: ShopProduct) => {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.priceValue,
      image: product.image,
      material: product.material,
      categoryLabel: product.categoryLabel,
      quantity: 1,
      availability: product.availability,
    });

    setAddedItemSlugs((prev) => ({ ...prev, [product.slug]: true }));
    setTimeout(() => {
      setAddedItemSlugs((prev) => ({ ...prev, [product.slug]: false }));
    }, 2000);

    showToast(`${product.name} added to Shopping Bag.`, "View Bag", "/cart");
  };

  const handleMoveAllToBag = () => {
    if (items.length === 0) return;

    items.forEach((product) => {
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.priceValue,
        image: product.image,
        material: product.material,
        categoryLabel: product.categoryLabel,
        quantity: 1,
        availability: product.availability,
      });
    });

    clearWishlist();
    showToast(`All ${items.length} items moved to your Shopping Bag.`, "View Bag", "/cart");
  };

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Curation link copied to clipboard.");
    }
  };

  const recommendedProducts = [shopProducts[0], shopProducts[1], shopProducts[7]];

  return (
    <div className={styles.wishlistPage}>
      {/* 1. Global Navigation */}
      <Navigation />

      {/* 2. Main Wishlist Container */}
      <main className={styles.mainContainer}>
        {/* Header & Breadcrumb */}
        <header className={styles.pageHeader}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <Link href="/shop">Atelier Boutique</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Saved Curations</span>
          </nav>

          <div className={styles.titleRow}>
            <div className={styles.titleGroup}>
              <h1 className={styles.pageTitle}>Saved Curations</h1>
              {wishlistCount > 0 && (
                <span className={styles.itemCountBadge}>
                  {wishlistCount} {wishlistCount === 1 ? "Creation" : "Creations"} Saved
                </span>
              )}
            </div>

            {wishlistCount > 0 && (
              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={styles.headerActionBtn}
                  onClick={handleShareWishlist}
                  title="Copy shareable curation link"
                >
                  Share Curation
                </button>
                <button
                  type="button"
                  className={`${styles.headerActionBtn} ${styles.primaryAction}`}
                  onClick={handleMoveAllToBag}
                >
                  Move All to Bag
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Populated Wishlist Grid */}
        {items.length > 0 ? (
          <div className={styles.wishlistGrid}>
            {items.map((product) => {
              const isAdded = !!addedItemSlugs[product.slug];

              return (
                <article key={product.slug} className={styles.wishlistCard}>
                  {/* Image Container */}
                  <div className={styles.cardImageWrapper}>
                    <div className={styles.cardBadgeGroup}>
                      <span className={styles.categoryTag}>{product.categoryLabel}</span>
                      {product.isNew && (
                        <span className={styles.categoryTag} style={{ background: "#c5a880", color: "#111" }}>
                          NEW
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.removeWishlistBtn}
                      onClick={() => removeFromWishlist(product.slug)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      title="Remove"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    <Link href={`/shop/${product.slug}`}>
                      <Image
                        src={product.image}
                        alt={product.imageAlt || product.name}
                        width={600}
                        height={400}
                        className={styles.cardImage}
                      />
                    </Link>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <Link href={`/shop/${product.slug}`} className={styles.productNameLink}>
                        {product.name}
                      </Link>
                      <span className={styles.productPrice}>{product.price}</span>
                    </div>

                    <p className={styles.productDescriptor}>{product.descriptor}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.materialLabel}>{product.material}</span>
                      <button
                        type="button"
                        className={`${styles.addToBagBtn} ${isAdded ? styles.addedSuccess : ""}`}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isAdded ? (
                          <>
                            <span>Added</span>
                            <span>&#10003;</span>
                          </>
                        ) : (
                          <>
                            <span>Add to Bag</span>
                            <span>&rarr;</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>Your Curation is Empty</h2>
            <p className={styles.emptySubtitle}>
              Save your preferred timepieces, straps, and accessories to review allocations or share
              your bespoke wishlist.
            </p>
            <Link href="/shop" className={styles.emptyCtaBtn}>
              Explore Boutique Timepieces &rarr;
            </Link>

            {/* Curated Recommendations */}
            <section className={styles.curatedSection}>
              <h3 className={styles.curatedHeading}>Signature Horological Pieces</h3>
              <div className={styles.curatedGrid}>
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <aside className={styles.toastNotification} role="status" aria-live="polite">
          <span>{toastMessage.text}</span>
          {toastMessage.linkHref && toastMessage.linkText && (
            <Link href={toastMessage.linkHref} className={styles.toastLink}>
              {toastMessage.linkText}
            </Link>
          )}
        </aside>
      )}

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
