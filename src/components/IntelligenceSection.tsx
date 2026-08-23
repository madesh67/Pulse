"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intelligenceContent } from "../lib/intelligenceContent";
import styles from "./IntelligenceSection.module.scss";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const IntelligenceSection: React.FC = () => {
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
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Reveal Each Capability Item on scroll
      const items = sectionRef.current?.querySelectorAll(`.${styles.capabilityItem}`);
      items?.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 3. Reveal Closing Block on scroll
      const closing = sectionRef.current?.querySelector(`.${styles.closingBlock}`);
      if (closing) {
        gsap.fromTo(
          closing,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: closing,
              start: "top 90%",
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

  const { sectionId, sectionIndex, sectionTag, headline, introCopy, capabilities, closing } =
    intelligenceContent;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={styles.intelligenceSection}
      aria-label="Section 02: Intelligence and Smart Experience"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.sectionHeader}>
          <div className={styles.headerMeta}>
            <span className={styles.sectionIndex}>{sectionIndex}</span>
            <span className={styles.metaDivider} aria-hidden="true" />
            <span className={styles.sectionTag}>{sectionTag}</span>
          </div>
          <h2 className={styles.mainHeadline}>{headline}</h2>
          <p className={styles.introParagraph}>{introCopy}</p>
        </header>

        {/* Intelligence Capabilities */}
        <div className={styles.capabilitiesList}>
          {capabilities.map((item) => {
            const isSplitLeft = item.layout === "split-left";

            return (
              <article
                key={item.id}
                className={`${styles.capabilityItem} ${
                  isSplitLeft ? styles.layoutSplitLeft : ""
                }`}
                aria-labelledby={`capability-title-${item.id}`}
              >
                {/* Content Column */}
                <div className={styles.contentColumn}>
                  <div className={styles.capabilityMeta}>
                    <span>{item.index}</span>
                    <span aria-hidden="true">/</span>
                    <span>{item.category}</span>
                  </div>

                  <h3 id={`capability-title-${item.id}`} className={styles.capabilityTitle}>
                    {item.title}
                  </h3>
                  <div className={styles.capabilitySubtitle}>{item.subtitle}</div>
                  <p className={styles.capabilityDescription}>{item.description}</p>

                  {/* Metrics Row */}
                  <div className={styles.metricsRow}>
                    {item.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className={styles.metricItem}>
                        <span className={styles.metricLabel}>{metric.label}</span>
                        <span className={styles.metricValue}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Column */}
                <div className={styles.visualColumn}>
                  <div className={styles.visualBezelOuter}>
                    <div className={styles.visualBezelInner}>
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className={styles.capabilityImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Closing */}
        <footer className={styles.closingBlock}>
          <span className={styles.closingLabel}>{closing.label}</span>
          <blockquote className={styles.closingQuote}>&ldquo;{closing.quote}&rdquo;</blockquote>
        </footer>
      </div>
    </section>
  );
};
