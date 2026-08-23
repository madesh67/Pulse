"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shopByCategoryContent, CategoryItem } from "../lib/categoriesContent";
import styles from "./ShopByCategorySection.module.scss";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ShopByCategorySection: React.FC = () => {
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

      // 2. Reveal Category Cards in Grid with Stagger
      const cards = sectionRef.current?.querySelectorAll(`.${styles.categoryCard}`);
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
              trigger: sectionRef.current?.querySelector(`.${styles.categoryGrid}`),
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

  const { sectionId, headline, introCopy, categories } =
    shopByCategoryContent;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={styles.sectionWrapper}
      aria-label="Section 02: Shop by Category"
    >
      <div className={styles.container}>
        {/* 1. Section Header */}
        <header className={styles.sectionHeader}>
          <h2 className={styles.mainHeadline}>{headline}</h2>
          <p className={styles.introParagraph}>{introCopy}</p>
        </header>

        {/* 2. Category Grid */}
        <div className={styles.categoryGrid}>
          {categories.map((category: CategoryItem, idx: number) => (
            <article
              key={category.id}
              className={styles.categoryCard}
              aria-labelledby={`category-title-${category.id}`}
            >
              {/* Category Visual */}
              <div className={styles.visualWrapper}>
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  width={1920}
                  height={1080}
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className={styles.categoryImage}
                  sizes="(max-width: 680px) 100vw, (max-width: 1200px) 50vw, 320px"
                />
              </div>

              {/* Category Content */}
              <div className={styles.categoryContent}>
                <div className={styles.categoryMeta}>
                  <span>{category.index}</span>
                  <span aria-hidden="true">/</span>
                  <span>{category.categoryTag}</span>
                </div>

                <h3 id={`category-title-${category.id}`} className={styles.categoryTitle}>
                  {category.name}
                </h3>
                <p className={styles.categoryDescription}>{category.description}</p>

                <a
                  href={category.href}
                  className={styles.exploreCta}
                  aria-label={`Explore ${category.name} category`}
                >
                  <span>{category.ctaText}</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>

              {/* Accessible Whole Card Overlay Click Target */}
              <a
                href={category.href}
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
