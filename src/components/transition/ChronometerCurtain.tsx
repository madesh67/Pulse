"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./ChronometerCurtain.module.scss";

export type TransitionStatus = "idle" | "exiting" | "navigating" | "entering";

export interface TargetRouteInfo {
  caliberCode: string;
  name: string;
  telemetry: string;
}

interface ChronometerCurtainProps {
  status: TransitionStatus;
  targetInfo: TargetRouteInfo;
  onExitComplete?: () => void;
  onEnterComplete?: () => void;
}

export const ChronometerCurtain: React.FC<ChronometerCurtainProps> = ({
  status,
  targetInfo,
  onExitComplete,
  onEnterComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shutterRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shutter = shutterRef.current;
    const hud = hudRef.current;
    const container = containerRef.current;
    if (!shutter || !hud || !container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Kill any active timeline
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (status === "idle") {
      gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(shutter, { yPercent: -100 });
      gsap.set(hud, { autoAlpha: 0, scale: 0.92 });
      return;
    }

    if (status === "exiting") {
      gsap.set(container, { autoAlpha: 1, pointerEvents: "auto" });

      if (prefersReducedMotion) {
        gsap.set(shutter, { yPercent: 0, opacity: 0 });
        const tl = gsap.timeline({
          onComplete: () => {
            onExitComplete?.();
          },
        });
        tl.to(shutter, { opacity: 1, duration: 0.2, ease: "power1.inOut" });
        tl.to(hud, { autoAlpha: 1, duration: 0.15 }, 0.05);
        tlRef.current = tl;
        return;
      }

      // High-precision horological sweep in
      const tl = gsap.timeline({
        onComplete: () => {
          onExitComplete?.();
        },
      });

      // Shutter slides down covering the screen
      tl.fromTo(
        shutter,
        { yPercent: -100 },
        {
          yPercent: 0,
          duration: 0.42,
          ease: "power4.inOut",
        }
      );

      // HUD scales and fades in at apex
      tl.fromTo(
        hud,
        { autoAlpha: 0, scale: 0.9, y: 16 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
        },
        "-=0.18"
      );

      tlRef.current = tl;
    } else if (status === "entering") {
      gsap.set(container, { autoAlpha: 1, pointerEvents: "auto" });

      if (prefersReducedMotion) {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
            onEnterComplete?.();
          },
        });
        tl.to(hud, { autoAlpha: 0, duration: 0.15 });
        tl.to(shutter, { opacity: 0, duration: 0.2, ease: "power1.inOut" }, 0.05);
        tlRef.current = tl;
        return;
      }

      // High-precision horological sweep out
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(shutter, { yPercent: -100 });
          onEnterComplete?.();
        },
      });

      // HUD fades out first
      tl.to(hud, {
        autoAlpha: 0,
        scale: 0.96,
        y: -12,
        duration: 0.22,
        ease: "power2.in",
      });

      // Shutter slides down out of view (or up)
      tl.to(
        shutter,
        {
          yPercent: 100,
          duration: 0.46,
          ease: "power4.inOut",
        },
        "-=0.1"
      );

      tlRef.current = tl;
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [status, onExitComplete, onEnterComplete]);

  return (
    <div
      ref={containerRef}
      className={`${styles.curtainOverlay} ${status !== "idle" ? styles.active : ""}`}
      aria-hidden={status === "idle"}
    >
      {/* 1. Primary Shutter & Gold Leading Hairline */}
      <div ref={shutterRef} className={styles.curtainShutter}>
        <div className={styles.curtainHairline} />
      </div>

      {/* 2. Horological Caliber HUD */}
      <div ref={hudRef} className={styles.hudContainer}>
        {/* Precision Dial Aperture */}
        <div className={styles.apertureDial}>
          <svg className={styles.dialSvg} viewBox="0 0 100 100" fill="none">
            {/* Outer Track */}
            <circle cx="50" cy="50" r="46" stroke="rgba(197, 168, 128, 0.25)" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="2 3" />

            {/* 12 Hour Precision Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="6"
                x2="50"
                y2={deg % 90 === 0 ? "14" : "10"}
                stroke={deg % 90 === 0 ? "#c5a880" : "rgba(255, 255, 255, 0.45)"}
                strokeWidth={deg % 90 === 0 ? "1.5" : "0.75"}
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </svg>

          {/* Sweeping Seconds Hand */}
          <div className={styles.escapementHand} />
          <div className={styles.dialCenterDot} />
        </div>

        {/* Brand Lockup */}
        <span className={styles.brandTitle}>PULSE</span>
        <span className={styles.brandSub}>CHRONOMETRY</span>

        {/* Caliber Indicator Badge */}
        <div className={styles.caliberBadge}>
          <span className={styles.caliberBadgeDot} />
          <span className={styles.caliberBadgeText}>
            {targetInfo.caliberCode} • {targetInfo.name}
          </span>
        </div>

        {/* Telemetry Footer */}
        <span className={styles.telemetry}>{targetInfo.telemetry}</span>
      </div>
    </div>
  );
};
