"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./TopProgressBar.module.scss";

export type TransitionStatus = "idle" | "exiting" | "navigating" | "entering";

interface TopProgressBarProps {
  status: TransitionStatus;
}

export const TopProgressBar: React.FC<TopProgressBarProps> = ({ status }) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const bar = barRef.current;
    const container = containerRef.current;
    if (!bar || !container) return;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (status === "idle") {
      gsap.set(container, { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0 });
      return;
    }

    if (status === "exiting" || status === "navigating") {
      gsap.set(container, { autoAlpha: 1 });
      const tl = gsap.timeline();
      tl.to(bar, {
        scaleX: 0.75,
        duration: 0.28,
        ease: "power2.out",
      });
      tlRef.current = tl;
    } else if (status === "entering") {
      const tl = gsap.timeline();
      tl.to(bar, {
        scaleX: 1,
        duration: 0.18,
        ease: "power3.out",
      }).to(
        container,
        {
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(bar, { scaleX: 0 });
          },
        },
        "+=0.04"
      );
      tlRef.current = tl;
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [status]);

  return (
    <div
      ref={containerRef}
      className={`${styles.progressBarContainer} ${status !== "idle" ? styles.active : ""}`}
      aria-hidden="true"
    >
      <div ref={barRef} className={styles.progressBarFill} />
    </div>
  );
};
