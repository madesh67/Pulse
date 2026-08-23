"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./SatinLouverTransition.module.scss";

export type TransitionStatus = "idle" | "exiting" | "navigating" | "entering";

interface SatinLouverTransitionProps {
  status: TransitionStatus;
  onCoverComplete?: () => void;
  onRevealComplete?: () => void;
}

export const SatinLouverTransition: React.FC<SatinLouverTransitionProps> = ({
  status,
  onCoverComplete,
  onRevealComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const emblemRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const emblem = emblemRef.current;
    const cols = columnsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!container || !emblem || cols.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (status === "idle") {
      gsap.set(container, { autoAlpha: 0 });
      gsap.set(cols, { scaleY: 0 });
      gsap.set(emblem, { autoAlpha: 0, scale: 0.94 });
      return;
    }

    if (status === "exiting") {
      gsap.set(container, { autoAlpha: 1 });

      if (prefersReducedMotion) {
        gsap.set(cols, { scaleY: 1, opacity: 0 });
        const tl = gsap.timeline({
          onComplete: () => {
            onCoverComplete?.();
          },
        });
        tl.to(cols, { opacity: 1, duration: 0.2, ease: "power1.inOut" });
        tl.to(emblem, { autoAlpha: 1, duration: 0.15 }, 0.05);
        tlRef.current = tl;
        return;
      }

      // Enter Phase: Louver slats scale down from top to cover the screen
      const tl = gsap.timeline({
        onComplete: () => {
          onCoverComplete?.();
        },
      });

      // Set transform origin to top
      gsap.set(cols, { transformOrigin: "top center", scaleY: 0 });

      tl.to(cols, {
        scaleY: 1,
        duration: 0.36,
        stagger: 0.04,
        ease: "power3.inOut",
      });

      // Emblem gently fades in
      tl.fromTo(
        emblem,
        { autoAlpha: 0, scale: 0.92 },
        { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" },
        "-=0.18"
      );

      tlRef.current = tl;
    } else if (status === "entering") {
      gsap.set(container, { autoAlpha: 1 });

      if (prefersReducedMotion) {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(container, { autoAlpha: 0 });
            onRevealComplete?.();
          },
        });
        tl.to(emblem, { autoAlpha: 0, duration: 0.15 });
        tl.to(cols, { opacity: 0, duration: 0.2, ease: "power1.inOut" }, 0.05);
        tlRef.current = tl;
        return;
      }

      // Exit Phase: Louver slats scale down to bottom to reveal the new page
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0 });
          gsap.set(cols, { scaleY: 0 });
          onRevealComplete?.();
        },
      });

      // Emblem fades out first
      tl.to(emblem, {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.18,
        ease: "power2.in",
      });

      // Change transform origin to bottom so slats part smoothly downwards
      tl.set(cols, { transformOrigin: "bottom center" });

      tl.to(
        cols,
        {
          scaleY: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power3.inOut",
        },
        "-=0.08"
      );

      tlRef.current = tl;
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [status, onCoverComplete, onRevealComplete]);

  return (
    <div
      ref={containerRef}
      className={`${styles.transitionOverlay} ${status !== "idle" ? styles.active : ""}`}
      aria-hidden={status === "idle"}
    >
      {/* 5 Vertical Louver Slats */}
      <div className={styles.louverGrid}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            ref={(el) => {
              columnsRef.current[idx] = el;
            }}
            className={styles.louverColumn}
          />
        ))}
      </div>

      {/* Center Atelier Emblem */}
      <div ref={emblemRef} className={styles.emblemContainer}>
        <div className={styles.emblemAperture}>
          <svg className={styles.apertureSvg} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="rgba(197, 168, 128, 0.4)" strokeWidth="1" />
            <circle cx="40" cy="40" r="30" stroke="rgba(26, 26, 26, 0.15)" strokeWidth="0.75" strokeDasharray="2 3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="40"
                y1="6"
                x2="40"
                y2={deg % 90 === 0 ? "13" : "10"}
                stroke={deg % 90 === 0 ? "#c5a880" : "rgba(26, 26, 26, 0.35)"}
                strokeWidth={deg % 90 === 0 ? "1.5" : "0.75"}
                transform={`rotate(${deg} 40 40)`}
              />
            ))}
          </svg>
          <div className={styles.apertureHand} />
          <div className={styles.apertureDot} />
        </div>

        <span className={styles.brandWordmark}>PULSE</span>
        <span className={styles.brandSubtext}>HAUTE HORLOGERIE • GENÈVE</span>
      </div>
    </div>
  );
};
