"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ProductGalleryItem } from "../../lib/productDetailData";
import styles from "./ProductGallery.module.scss";

interface ProductGalleryProps {
  gallery?: ProductGalleryItem[];
  productName: string;
  activeImageOverride?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  gallery,
  productName,
  activeImageOverride,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentImageSrc =
    activeImageOverride ||
    (gallery && gallery.length > 0 ? gallery[0].src : "/assets/offers/first-time-offer.png");
  const currentImageAlt =
    (gallery && gallery.length > 0 ? gallery[0].alt : productName) || productName;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <section className={styles.galleryWrapper} aria-label={`${productName} Showcase`}>
      <div className={styles.mainImageArea}>
        <div
          ref={imageContainerRef}
          className={`${styles.mainImageContainer} ${isZoomed ? styles.zoomed : ""}`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          role="region"
          aria-label="Product zoom preview"
        >
          <Image
            src={currentImageSrc}
            alt={currentImageAlt}
            width={1200}
            height={860}
            priority
            loading="eager"
            className={styles.mainImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 750px"
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />

          <div className={styles.zoomHint} aria-hidden="true">
            <svg
              className={styles.zoomIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>Hover to inspect</span>
          </div>
        </div>
      </div>
    </section>
  );
};
