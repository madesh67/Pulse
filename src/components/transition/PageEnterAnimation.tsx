"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./PageEnterAnimation.module.scss";

export const PageEnterAnimation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 20,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.48,
          ease: "power3.out",
          clearProps: "transform,filter",
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.pageEnterWrapper}>
      {children}
    </div>
  );
};
