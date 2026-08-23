"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./LiquidWaveTransition.module.scss";

export type TransitionStatus = "idle" | "exiting" | "navigating" | "entering";

interface LiquidWaveTransitionProps {
  status: TransitionStatus;
  onCoverComplete?: () => void;
  onRevealComplete?: () => void;
}

export const LiquidWaveTransition: React.FC<LiquidWaveTransitionProps> = ({
  status,
  onCoverComplete,
  onRevealComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillPathRef = useRef<SVGPathElement | null>(null);
  const strokePathRef = useRef<SVGPathElement | null>(null);
  const emblemRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const fillPath = fillPathRef.current;
    const strokePath = strokePathRef.current;
    const emblem = emblemRef.current;
    if (!container || !fillPath || !strokePath || !emblem) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (status === "idle") {
      gsap.set(container, { autoAlpha: 0 });
      fillPath.setAttribute("d", "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z");
      strokePath.setAttribute("d", "M 0 100 Q 50 100 100 100");
      gsap.set(emblem, { autoAlpha: 0, scale: 0.92 });
      return;
    }

    if (status === "exiting") {
      gsap.set(container, { autoAlpha: 1 });

      if (prefersReducedMotion) {
        fillPath.setAttribute("d", "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z");
        gsap.set(container, { opacity: 0 });
        const tl = gsap.timeline({
          onComplete: () => {
            onCoverComplete?.();
          },
        });
        tl.to(container, { opacity: 1, duration: 0.15, ease: "power1.inOut" });
        tl.to(emblem, { autoAlpha: 1, duration: 0.15 }, 0.05);
        tlRef.current = tl;
        return;
      }

      // Enter Phase: Liquid Bezier Wave sweeps up from bottom
      const wave = { y: 100, curve: 0 };
      const tl = gsap.timeline({
        onUpdate: () => {
          fillPath.setAttribute(
            "d",
            `M 0 ${wave.y} Q 50 ${wave.y - wave.curve} 100 ${wave.y} L 100 100 L 0 100 Z`
          );
          strokePath.setAttribute(
            "d",
            `M 0 ${wave.y} Q 50 ${wave.y - wave.curve} 100 ${wave.y}`
          );
        },
        onComplete: () => {
          onCoverComplete?.();
        },
      });

      // Wave vertical sweep
      tl.to(wave, {
        y: 0,
        duration: 0.44,
        ease: "power3.inOut",
      });

      // Wave curvature dynamics (bulges up, then flattens at top)
      tl.to(
        wave,
        {
          curve: 34,
          duration: 0.22,
          ease: "power2.out",
        },
        0
      );
      tl.to(
        wave,
        {
          curve: 0,
          duration: 0.22,
          ease: "power2.in",
        },
        0.22
      );

      // Emblem ascends in velocity sync with wave apex
      tl.fromTo(
        emblem,
        { autoAlpha: 0, scale: 0.88, y: 22 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.26, ease: "power3.out" },
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
        tl.to(container, { opacity: 0, duration: 0.15, ease: "power1.inOut" }, 0.05);
        tlRef.current = tl;
        return;
      }

      // Exit Phase: Liquid Bezier Wave uncovers downwards from top to bottom
      const wave = { y: 100, curve: 0 };
      const tl = gsap.timeline({
        onUpdate: () => {
          fillPath.setAttribute(
            "d",
            `M 0 0 L 100 0 L 100 ${wave.y} Q 50 ${wave.y - wave.curve} 0 ${wave.y} Z`
          );
          strokePath.setAttribute(
            "d",
            `M 100 ${wave.y} Q 50 ${wave.y - wave.curve} 0 ${wave.y}`
          );
        },
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0 });
          fillPath.setAttribute("d", "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z");
          strokePath.setAttribute("d", "M 0 100 Q 50 100 100 100");
          onRevealComplete?.();
        },
      });

      // Emblem fades and drifts out first
      tl.to(emblem, {
        autoAlpha: 0,
        scale: 0.95,
        y: -14,
        duration: 0.18,
        ease: "power2.in",
      });

      // Wave uncovers upward
      tl.to(
        wave,
        {
          y: 0,
          duration: 0.46,
          ease: "power3.inOut",
        },
        "-=0.08"
      );

      // Curve pulls upward into a dome and flattens off-screen
      tl.to(
        wave,
        {
          curve: 34,
          duration: 0.23,
          ease: "power2.out",
        },
        "-=0.46"
      );
      tl.to(
        wave,
        {
          curve: 0,
          duration: 0.23,
          ease: "power2.in",
        },
        "-=0.23"
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
      className={`${styles.waveOverlay} ${status !== "idle" ? styles.active : ""}`}
      aria-hidden={status === "idle"}
    >
      {/* 1. Liquid Bezier Curved Wave (Preserve Aspect Ratio = None for full screen stretch) */}
      <svg
        className={styles.waveSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#131316" />
            <stop offset="60%" stopColor="#0c0c0e" />
            <stop offset="100%" stopColor="#080809" />
          </linearGradient>
          <linearGradient id="goldHorizonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(197, 168, 128, 0.1)" />
            <stop offset="25%" stopColor="rgba(197, 168, 128, 0.85)" />
            <stop offset="50%" stopColor="#e8cf96" />
            <stop offset="75%" stopColor="rgba(197, 168, 128, 0.85)" />
            <stop offset="100%" stopColor="rgba(197, 168, 128, 0.1)" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fluid Obsidian Titanium Wave Body */}
        <path
          ref={fillPathRef}
          d="M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
          fill="url(#waveGradient)"
        />

        {/* Glowing Gold Horizon Hairline Arc */}
        <path
          ref={strokePathRef}
          d="M 0 100 Q 50 100 100 100"
          fill="none"
          stroke="url(#goldHorizonGradient)"
          strokeWidth="0.8"
          filter="url(#goldGlow)"
        />
      </svg>

      {/* 2. Center Brand Lockup & Rotating Escapement Dial */}
      <div ref={emblemRef} className={styles.centerEmblem}>
        <div className={styles.apertureRing}>
          <svg className={styles.apertureSvg} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="rgba(197, 168, 128, 0.35)" strokeWidth="1" />
            <circle cx="40" cy="40" r="30" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="2 3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="40"
                y1="6"
                x2="40"
                y2={deg % 90 === 0 ? "13" : "10"}
                stroke={deg % 90 === 0 ? "#c5a880" : "rgba(255, 255, 255, 0.4)"}
                strokeWidth={deg % 90 === 0 ? "1.5" : "0.75"}
                transform={`rotate(${deg} 40 40)`}
              />
            ))}
          </svg>
          <div className={styles.escapementArm} />
          <div className={styles.centerRuby} />
        </div>

        <span className={styles.brandWordmark}>PULSE</span>
        <span className={styles.brandDescriptor}>CHRONOMETRY • GENÈVE</span>
      </div>
    </div>
  );
};
