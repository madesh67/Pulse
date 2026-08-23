"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offerBannerContent } from "../lib/offerBannerContent";
import styles from "./OfferBanner.module.scss";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Precise Remaining Time Calculator anchored to exact second boundaries
function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function getInitialRemainingSeconds() {
  const BLOCK_SECONDS = 12 * 3600;
  const nowSec = Math.floor(Date.now() / 1000);
  return BLOCK_SECONDS - (nowSec % BLOCK_SECONDS);
}

export const OfferBanner: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>(() =>
    formatTime(getInitialRemainingSeconds())
  );
  const [copied, setCopied] = useState(false);

  // Exact Drift-Compensated Countdown Timer
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      setTimeLeft(formatTime(getInitialRemainingSeconds()));
      // Synchronize timeout exactly to the next whole-second boundary
      const nextMs = 1000 - (Date.now() % 1000);
      timerId = setTimeout(tick, nextMs);
    };

    tick();
    return () => clearTimeout(timerId);
  }, []);

  // GSAP ScrollTrigger Reveal Animations
  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal Showcase Card on scroll
      const cardEl = sectionRef.current?.querySelector(`.${styles.bannerCard}`);
      if (cardEl) {
        gsap.fromTo(
          cardEl,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardEl,
              start: "top 85%",
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

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(offerBannerContent.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const {
    sectionId,
    badge,
    watchName,
    watchSubtitle,
    originalPrice,
    offerPrice,
    discountPercentage,
    promoCode,
    ctaText,
    ctaHref,
    image,
    imageAlt,
    guarantees,
  } = offerBannerContent;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={styles.sectionWrapper}
      aria-label="First-Time Buyer Offer"
    >
      <div className={styles.container}>
        {/* Offer Showcase Card */}
        <div className={styles.bannerCard}>
          {/* Privilege Pill Badge */}
          <div className={styles.privilegeBadge}>
            <span>{badge}</span>
          </div>

          {/* Header Group */}
          <div className={styles.headerGroup}>
            <h3 className={styles.watchTitle}>{watchName}</h3>
            <p className={styles.watchSubtitle}>{watchSubtitle}</p>
          </div>

          {/* Watch Visual Column */}
          <div className={styles.visualCol}>
            <div className={styles.visualWrapper}>
              <Image
                src={image}
                alt={imageAlt}
                width={502}
                height={655}
                priority
                className={styles.watchImage}
                sizes="(max-width: 1100px) 100vw, 550px"
              />
            </div>
          </div>

          {/* Pricing & Promo Code */}
          <div className={styles.priceAndPromoRow}>
            <div className={styles.pricingBlock}>
              <span className={styles.offerPrice}>{offerPrice}</span>
              <span className={styles.originalPrice}>{originalPrice}</span>
              <span className={styles.discountBadge}>{discountPercentage}</span>
            </div>

            <div className={styles.promoCodeBox}>
              <span className={styles.promoCodeLabel}>CODE:</span>
              <span className={styles.promoCodeValue}>{promoCode}</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className={`${styles.copyCodeBtn} ${copied ? styles.copied : ""}`}
                aria-label="Copy promotion code"
              >
                {copied ? "COPIED ✓" : "COPY"}
              </button>
            </div>
          </div>

          {/* Exclusive Allocation Window Countdown Timer */}
          <div className={styles.timerContainer}>
            <div className={styles.timerHeader}>
              <span className={styles.timerLabel}>Inaugural Allocation Window</span>
              <span className={styles.timerResetInfo}>Limited Availability</span>
            </div>

            <div className={styles.timerDigitsRow}>
              <div className={styles.digitBox}>
                <span className={styles.digitValue}>{timeLeft.hours}</span>
                <span className={styles.digitUnit}>HOURS</span>
              </div>
              <span className={styles.digitSeparator} aria-hidden="true">
                :
              </span>
              <div className={styles.digitBox}>
                <span className={styles.digitValue}>{timeLeft.minutes}</span>
                <span className={styles.digitUnit}>MINS</span>
              </div>
              <span className={styles.digitSeparator} aria-hidden="true">
                :
              </span>
              <div className={styles.digitBox}>
                <span className={styles.digitValue}>{timeLeft.seconds}</span>
                <span className={styles.digitUnit}>SECS</span>
              </div>
            </div>
          </div>

          {/* CTA & Benefits */}
          <div className={styles.actionRow}>
            <a href={ctaHref} className={styles.claimButton}>
              <span>{ctaText}</span>
              <span className={styles.btnArrow} aria-hidden="true">
                &rarr;
              </span>
            </a>
          </div>

          {/* Guarantees List */}
          <div className={styles.guaranteesGrid}>
            {guarantees.map((item, idx) => (
              <div key={idx} className={styles.guaranteeItem}>
                <span className={styles.checkIcon} aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
