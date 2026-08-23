"use client";

import React from "react";
import Image from "next/image";
import { ProductDetail } from "../../lib/productDetailData";
import styles from "./ProductStory.module.scss";

interface ProductStoryProps {
  product: ProductDetail;
}

export const ProductStory: React.FC<ProductStoryProps> = ({ product }) => {
  const { name, shortStory, material, gallery } = product;
  const secondaryImage = gallery && gallery.length > 1 ? gallery[1].src : product.image;

  return (
    <section className={styles.storySection} aria-label="Product Overview & Design Philosophy">
      <div className={styles.storyHeader}>
        <span className={styles.sectionTag}>01 / ATELIER OVERVIEW</span>
        <h2 className={styles.storyHeadline}>{shortStory.headline}</h2>
      </div>

      <div className={styles.storyGrid}>
        {/* Left: Narrative Content */}
        <div className={styles.textContent}>
          <p className={styles.paragraph}>{shortStory.paragraph1}</p>
          {shortStory.paragraph2 && (
            <p className={styles.paragraph}>{shortStory.paragraph2}</p>
          )}

          {shortStory.quote && (
            <blockquote className={styles.quoteBlock}>
              <p>&ldquo;{shortStory.quote}&rdquo;</p>
              <cite>&mdash; PULSE Atelier Horology Group</cite>
            </blockquote>
          )}

          <div className={styles.materialHighlight}>
            <div className={styles.materialKey}>PRIMARY COMPOSITION</div>
            <div className={styles.materialVal}>{material}</div>
          </div>
        </div>

        {/* Right: Architectural Detail Imagery */}
        <div className={styles.visualSide}>
          <div className={styles.imageFrame}>
            <Image
              src={secondaryImage}
              alt={`${name} material detail`}
              width={700}
              height={500}
              loading="lazy"
              className={styles.detailImage}
              sizes="(max-width: 900px) 100vw, 500px"
            />
          </div>
          <span className={styles.imageCaption}>
            Precision surface finish and ergonomic contouring engineered for life on the wrist.
          </span>
        </div>
      </div>
    </section>
  );
};
