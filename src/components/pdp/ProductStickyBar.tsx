"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ProductStickyBar.module.scss";

interface ProductStickyBarProps {
  productName: string;
  price: string;
  image: string;
  configSummary?: string;
  onReserveClick: () => void;
  triggerElementId?: string;
}

export const ProductStickyBar: React.FC<ProductStickyBarProps> = ({
  productName,
  price,
  image,
  configSummary,
  onReserveClick,
  triggerElementId = "primary-purchase-cta",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const triggerEl = document.getElementById(triggerElementId);
      if (!triggerEl) return;

      const rect = triggerEl.getBoundingClientRect();
      // When primary CTA has scrolled above the viewport, show sticky bar
      if (rect.bottom < 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [triggerElementId]);

  return (
    <aside
      className={`${styles.stickyBar} ${isVisible ? styles.visible : ""}`}
      aria-label="Quick Purchase Bar"
      aria-hidden={!isVisible}
    >
      <div className={styles.container}>
        {/* Left: Product Thumbnail & Name */}
        <div className={styles.productInfo}>
          <div className={styles.thumbWrapper}>
            <Image
              src={image}
              alt=""
              width={50}
              height={50}
              className={styles.thumbImage}
            />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.brandTag}>PULSE</span>
            <span className={styles.productName}>{productName}</span>
            {configSummary && (
              <span className={styles.configSummary}>{configSummary}</span>
            )}
          </div>
        </div>

        {/* Right: Price & Quick CTA */}
        <div className={styles.actionGroup}>
          <span className={styles.price}>{price}</span>
          <button
            type="button"
            className={styles.quickCta}
            onClick={onReserveClick}
            aria-label={`Reserve ${productName} for ${price}`}
          >
            <span>RESERVE</span>
            <span className={styles.arrow} aria-hidden="true">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
