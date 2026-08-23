"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopProduct } from "../../lib/shopProductsData";
import styles from "./ProductRelated.module.scss";

interface ProductRelatedProps {
  relatedProducts: ShopProduct[];
}

export const ProductRelated: React.FC<ProductRelatedProps> = ({
  relatedProducts,
}) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className={styles.relatedSection} aria-label="Explore more complementary pieces">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>05 / COMPLEMENTARY PIECES</span>
        <h2 className={styles.sectionTitle}>Explore More From PULSE</h2>
      </div>

      <div className={styles.productGrid}>
        {relatedProducts.map((prod) => (
          <Link
            key={prod.slug}
            href={`/shop/${prod.slug}`}
            className={styles.cardWrapper}
            aria-label={`View ${prod.name} - ${prod.price}`}
          >
            <div className={styles.imageContainer}>
              <span className={styles.categoryBadge}>{prod.categoryLabel}</span>
              <Image
                src={prod.image}
                alt={prod.imageAlt || prod.name}
                width={500}
                height={380}
                loading="lazy"
                className={styles.productImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
              />
            </div>

            <div className={styles.contentSection}>
              <div className={styles.headerRow}>
                <h3 className={styles.productName}>{prod.name}</h3>
                <span className={styles.productPrice}>{prod.price}</span>
              </div>
              <p className={styles.descriptor}>{prod.descriptor}</p>
              <div className={styles.exploreLink}>
                <span>EXPLORE TIMEPIECE</span>
                <span className={styles.arrow} aria-hidden="true">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
