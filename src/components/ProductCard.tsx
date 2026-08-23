"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopProduct } from "../lib/shopProductsData";
import { useWishlist } from "../context";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: ShopProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    slug,
    name,
    categoryLabel,
    descriptor,
    material,
    price,
    image,
    imageAlt,
    isNew,
  } = product;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(slug);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      href={`/shop/${slug}`}
      className={styles.cardWrapper}
      aria-label={`View details for ${name} - ${price}`}
    >
      {/* 1. Image Container */}
      <div className={styles.imageContainer}>
        <div className={styles.badgeContainer}>
          <span className={styles.categoryBadge}>{categoryLabel}</span>
          {isNew && <span className={styles.newBadge}>NEW</span>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`${styles.cardWishlistBtn} ${isWishlisted ? styles.inWishlist : ""}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
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

        <Image
          src={image}
          alt={imageAlt}
          width={800}
          height={550}
          loading="lazy"
          className={styles.productImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />
      </div>

      {/* 2. Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.headerRow}>
          <h3 className={styles.productName}>{name}</h3>
          <span className={styles.productPrice}>{price}</span>
        </div>

        <p className={styles.descriptor}>{descriptor}</p>

        <div className={styles.footerRow}>
          <span className={styles.materialTag}>{material}</span>
          <span className={styles.actionLink}>
            <span>EXPLORE</span>
            <span className={styles.arrow} aria-hidden="true">
              &rarr;
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};
