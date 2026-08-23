"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmartwatchCanvasRef } from "../components/SmartwatchCanvas";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

interface UseWatchScrollAnimationProps {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  pinRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<SmartwatchCanvasRef | null>;
  totalFrames: number;
}

export function useWatchScrollAnimation({
  triggerRef,
  pinRef,
  canvasRef,
  totalFrames,
}: UseWatchScrollAnimationProps) {
  useEffect(() => {
    const trigger = triggerRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;

    if (!trigger || !pin || !canvas) return;

    // Support direct frame inspection via query parameter (?frame=160)
    const urlParams = new URLSearchParams(window.location.search);
    const forceFrameParam = urlParams.get("frame");
    if (forceFrameParam !== null) {
      const targetFrame = parseInt(forceFrameParam, 10);
      if (!isNaN(targetFrame) && targetFrame >= 0 && targetFrame < totalFrames) {
        // Render target frame once preloader finishes and canvas mounts
        const checkAndDraw = () => {
          canvasRef.current?.updateFrame(targetFrame);
        };
        checkAndDraw();
        const t1 = setTimeout(checkAndDraw, 100);
        const t2 = setTimeout(checkAndDraw, 500);
        const t3 = setTimeout(checkAndDraw, 1000);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    }

    // Initialize GSAP Timeline inside a GSAP Context for scoped selector query and clean cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          pin: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: true, // Direct 1:1 scroll tracking with Lenis, eliminating scrub lag/lock feel
          pinSpacing: true,
        },
      });

      // === CONTINUOUS UNINTERRUPTED FRAME SCRUBBING ===
      const frameObj = { frame: 0 };
      tl.to(
        frameObj,
        {
          frame: totalFrames - 1,
          roundProps: "frame",
          ease: "none",
          duration: 1.0,
          onUpdate: () => {
            canvasRef.current?.updateFrame(frameObj.frame);
          },
        },
        0
      );

      // === HERO INTRO (fades out smoothly) ===
      tl.to(
        ".hero-intro",
        {
          autoAlpha: 0,
          y: -30,
          ease: "power2.inOut",
          duration: 0.08,
        },
        0.02
      );

      // === DISPLAY FEATURE (synchronized with output_0111.jpg / index 66 ≈ progress 0.15) ===
      tl.fromTo(
        ".display-feature",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.05 },
        0.07
      );
      tl.to(
        ".display-feature",
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.04 },
        0.22
      );

      // === FEATURE 2 (03 / CONTROLS - output_0205.jpg to output_0250.jpg ≈ progress 0.355 to 0.455) ===
      tl.fromTo(
        ".feature-2",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.025 },
        0.355
      );
      tl.to(
        ".feature-2",
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.025 },
        0.430
      );

      // === FEATURE 3 (04 / AUDIO & RETURN - output_0290.jpg to output_0330.jpg ≈ progress 0.543 to 0.632) ===
      tl.fromTo(
        ".feature-3",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.025 },
        0.543
      );
      tl.to(
        ".feature-3",
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.025 },
        0.607
      );

      // === FEATURE 4 (05 / STRAP & MATERIALITY - output_0340.jpg to output_0380.jpg ≈ progress 0.654 to 0.743) ===
      tl.fromTo(
        ".feature-4",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.03 },
        0.654
      );
      tl.to(
        ".feature-4",
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.03 },
        0.720
      );

      // === FINAL CTA (ARCHITECTURE - Final assembled watch reveal & reserve) ===
      tl.fromTo(
        ".hero-final",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.06 },
        0.82
      );

    }, trigger);

    return () => {
      ctx.revert(); // Safely kill all ScrollTriggers and timelines created inside the context
    };
  }, [triggerRef, pinRef, canvasRef, totalFrames]);
}

