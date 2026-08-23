"use client";

import React, { useState } from "react";
import { ProductDetail, ProductVariantGroup } from "../../lib/productDetailData";
import { useCart, useWishlist } from "../../context";
import { shopProducts, ShopProduct } from "../../lib/shopProductsData";
import styles from "./ProductPurchasePanel.module.scss";

interface ProductPurchasePanelProps {
  product: ProductDetail;
  selectedVariants: Record<string, string>;
  onVariantChange: (groupId: string, optionId: string) => void;
  calculatedPrice: number;
  onReserveClick: () => void;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
  selectedVariants,
  onVariantChange,
  calculatedPrice,
  onReserveClick,
}) => {
  const {
    slug,
    name,
    categoryLabel,
    descriptor,
    material,
    availability,
    isNew,
    variantGroups,
  } = product;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(slug);
  const [isBagAdded, setIsBagAdded] = useState(false);

  const isLimited = availability.toLowerCase().includes("limited");
  const isTimepiece = product.category === "smartwatches" || product.category === "editions";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Build summary of chosen variants
  const getVariantSummary = () => {
    if (!variantGroups || variantGroups.length === 0) return material;
    const parts: string[] = [];
    variantGroups.forEach((group) => {
      const selectedId = selectedVariants[group.id] || group.defaultOptionId;
      const opt = group.options.find((o) => o.id === selectedId);
      if (opt) parts.push(opt.label);
    });
    return parts.join(" • ") || material;
  };

  const handleAddToBag = () => {
    const mainImage = product.gallery && product.gallery.length > 0 ? product.gallery[0].src : "/assets/products/pulse-nova-pro.png";

    addItem({
      slug,
      name,
      price: calculatedPrice,
      image: mainImage,
      material,
      categoryLabel,
      selectedVariants,
      variantSummary: getVariantSummary(),
      quantity: 1,
      availability,
    });

    setIsBagAdded(true);
    setTimeout(() => {
      setIsBagAdded(false);
    }, 2500);
  };

  const handleWishlistToggle = () => {
    const matchedShopProduct: ShopProduct = shopProducts.find((p) => p.slug === slug) || {
      id: product.id || slug,
      slug,
      name,
      category: product.category,
      categoryLabel,
      descriptor,
      material,
      price: formatCurrency(calculatedPrice),
      priceValue: calculatedPrice,
      image: product.gallery && product.gallery.length > 0 ? product.gallery[0].src : "/assets/products/pulse-nova-pro.png",
      imageAlt: name,
      availability,
      featured: false,
      isNew: !!isNew,
    };
    toggleWishlist(matchedShopProduct);
  };

  return (
    <div className={styles.panelWrapper}>
      {/* 1. Category & Availability Header */}
      <div className={styles.metaRow}>
        <div className={styles.categoryBadgeGroup}>
          <span className={styles.categoryBadge}>{categoryLabel}</span>
          <span className={styles.materialBadge}>{material}</span>
          {isNew && <span className={styles.newBadge}>NEW ARRIVAL</span>}
        </div>

        <div
          className={`${styles.availabilityBadge} ${
            isLimited ? styles.limitedBadge : styles.inStockBadge
          }`}
        >
          <span className={styles.statusDot} aria-hidden="true" />
          <span>{availability}</span>
        </div>
      </div>

      {/* 2. Product Name & Short Descriptor */}
      <h1 className={styles.productName}>{name}</h1>
      <p className={styles.descriptor}>{descriptor}</p>

      {/* 3. Price & Material Row */}
      <div className={styles.priceRow}>
        <div className={styles.priceDisplay}>
          <span className={styles.priceValue}>{formatCurrency(calculatedPrice)}</span>
          <span className={styles.taxNotice}>USD &bull; Taxes & shipping calculated at reservation</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* 4. Configuration Selectors (if product has variant options) */}
      {variantGroups && variantGroups.length > 0 && (
        <div className={styles.configSection} aria-label="Product Configuration Options">
          {variantGroups.map((group: ProductVariantGroup) => {
            const selectedOptId = selectedVariants[group.id] || group.defaultOptionId;
            const currentSelected = group.options.find((o) => o.id === selectedOptId);

            return (
              <fieldset key={group.id} className={styles.variantGroup}>
                <div className={styles.groupHeader}>
                  <legend className={styles.groupTitle}>{group.name}</legend>
                  {currentSelected && (
                    <span className={styles.selectedLabel}>
                      {currentSelected.label}
                    </span>
                  )}
                </div>

                <div className={styles.optionList} role="radiogroup" aria-label={group.name}>
                  {group.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    const hasColor = !!opt.colorHex;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`${styles.optionBtn} ${
                          isSelected ? styles.activeOption : ""
                        }`}
                        onClick={() => onVariantChange(group.id, opt.id)}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${opt.label} ${opt.priceDelta ? `(${formatCurrency(opt.priceDelta)})` : ""}`}
                      >
                        {hasColor && (
                          <span
                            className={styles.colorSwatch}
                            style={{ backgroundColor: opt.colorHex }}
                            aria-hidden="true"
                          />
                        )}
                        <span className={styles.optionText}>{opt.label}</span>
                        {opt.priceDelta && opt.priceDelta > 0 && (
                          <span className={styles.priceDelta}>
                            (+{formatCurrency(opt.priceDelta)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}

      {/* 5. Primary Purchase & Action Buttons */}
      <div className={styles.actionContainer}>
        <div className={styles.buttonRow}>
          {/* Add to Bag Button */}
          <button
            type="button"
            className={`${styles.secondaryCta} ${isBagAdded ? styles.addedSuccess : ""}`}
            onClick={handleAddToBag}
            aria-label={`Add ${name} to Shopping Bag`}
          >
            <span>{isBagAdded ? "Added to Bag ✓" : "Add to Bag"}</span>
          </button>

          {/* Primary Action Button (Reservation / Direct Acquisition) */}
          <button
            type="button"
            className={styles.primaryCta}
            onClick={onReserveClick}
            id="primary-purchase-cta"
            aria-label={`${isTimepiece ? "Reserve" : "Direct Acquisition"} ${name}`}
          >
            <span>{isTimepiece ? "Reserve" : "Acquire"}</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              &rarr;
            </span>
          </button>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            className={`${styles.pdpWishlistBtn} ${isWishlisted ? styles.inWishlist : ""}`}
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <p className={styles.actionNote}>
          {isTimepiece
            ? "Direct allocation from the PULSE Atelier. Includes complimentary insured courier dispatch."
            : "In stock and ready for immediate dispatch from our regional boutique fulfillment hub."}
        </p>
      </div>

      {/* 6. Atelier Trust Badges */}
      <div className={styles.servicesGrid} aria-label="Atelier Guarantees">
        <div className={styles.serviceItem}>
          <svg
            className={styles.serviceIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div className={styles.serviceText}>
            <strong>Complimentary Express Shipping</strong>
            <span>Insured direct courier delivery with signature required</span>
          </div>
        </div>

        <div className={styles.serviceItem}>
          <svg
            className={styles.serviceIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div className={styles.serviceText}>
            <strong>2-Year Atelier Warranty</strong>
            <span>Comprehensive international protection and servicing</span>
          </div>
        </div>

        <div className={styles.serviceItem}>
          <svg
            className={styles.serviceIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <div className={styles.serviceText}>
            <strong>30-Day Evaluation Return</strong>
            <span>Complimentary return or exchange in original packaging</span>
          </div>
        </div>
      </div>
    </div>
  );
};
