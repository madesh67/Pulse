"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopProduct } from "../lib/shopProductsData";
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
