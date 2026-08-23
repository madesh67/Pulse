"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { popularCollectionsContent, CollectionItem } from "../lib/popularCollectionsContent";
import styles from "./PopularCollections.module.scss";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const PopularCollections: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    // Check system accessibility reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // In reduced motion mode, render elements statically without animation delays
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal Section Header on scroll
      const headerEl = sectionRef.current?.querySelector(`.${styles.sectionHeader}`);
      if (headerEl) {
        gsap.fromTo(
          headerEl,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Reveal Product Cards in Grid with Stagger
      const cards = sectionRef.current?.querySelectorAll(`.${styles.productCard}`);
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(`.${styles.productGrid}`),
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const { sectionId, headline, introCopy, collections } =
    popularCollectionsContent;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={styles.sectionWrapper}
      aria-label="Section 03: Popular Collections"
    >
      <div className={styles.container}>
        {/* 1. Section Header */}
        <header className={styles.sectionHeader}>
          <h2 className={styles.mainHeadline}>{headline}</h2>
          <p className={styles.introParagraph}>{introCopy}</p>
        </header>

        {/* 2. Product Grid */}
        <div className={styles.productGrid}>
          {collections.map((collection: CollectionItem, idx: number) => (
            <article
              key={collection.id}
              className={styles.productCard}
              aria-labelledby={`product-title-${collection.id}`}
            >
              {/* Product Visual */}
              <div className={styles.visualWrapper}>
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  width={1920}
                  height={1080}
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className={styles.productImage}
                  sizes="(max-width: 680px) 100vw, (max-width: 1200px) 50vw, 320px"
                />
              </div>

              {/* Product Content */}
              <div className={styles.productContent}>
                <div className={styles.productMeta}>
                  <span>{collection.index}</span>
                  <span aria-hidden="true">/</span>
                  <span>{collection.category}</span>
                </div>

                <h3 id={`product-title-${collection.id}`} className={styles.productTitle}>
                  {collection.name}
                </h3>
                <p className={styles.productDescription}>{collection.description}</p>

                <Link
                  href={collection.href}
                  className={styles.exploreCta}
                  aria-label={`Explore ${collection.name} collection`}
                >
                  <span>{collection.ctaText}</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>

              {/* Accessible Whole Card Overlay Click Target */}
              <Link
                href={collection.href}
                className={styles.cardLinkOverlay}
                tabIndex={-1}
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
