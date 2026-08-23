"use client";

import React, { useEffect, useRef, useCallback, useImperativeHandle } from "react";
import manifest from "../../public/assets/frames/manifest.json";

export interface SmartwatchCanvasRef {
  updateFrame: (index: number) => void;
}

interface SmartwatchCanvasProps {
  getFrameImage: (index: number) => HTMLImageElement | null;
  getFrameBgColor: (index: number) => string;
  totalFrames?: number;
  className?: string;
  initialFrame?: number;
}

interface ScaleKeyframe {
  progress: number;
  scale: number;
}

// Piecewise smoothstep (ease-in-out) interpolation helper
function getInterpolatedValue(p: number, keyframes: ScaleKeyframe[]): number {
  if (p <= keyframes[0].progress) return keyframes[0].scale;
  if (p >= keyframes[keyframes.length - 1].progress) return keyframes[keyframes.length - 1].scale;
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (p >= k1.progress && p <= k2.progress) {
      const t = (p - k1.progress) / (k2.progress - k1.progress);
      const easeT = t * t * (3 - 2 * t); // Smoothstep easing
      return k1.scale + (k2.scale - k1.scale) * easeT;
    }
  }
  return 1.0;
}

const USE_VIDEO_MODE = false; // Temporary toggle for video mode testing

export const SmartwatchCanvas = React.forwardRef<SmartwatchCanvasRef, SmartwatchCanvasProps>(
  ({ getFrameImage, getFrameBgColor, totalFrames, className = "", initialFrame = 0 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    
    // Store current frame in a mutable ref to prevent React re-renders on every scroll tick
    const currentFrameRef = useRef<number>(initialFrame);

    // Track last rendered parameters to avoid redundant draws
    const lastRenderedRef = useRef<{
      frame: number;
      width: number;
      height: number;
      imageSrc: string | null;
      scale: number;
      xOffsetRatio: number;
      yOffsetRatio: number;
    }>({
      frame: -1,
      width: -1,
      height: -1,
      imageSrc: null,
      scale: -1,
      xOffsetRatio: -999,
      yOffsetRatio: -999,
    });

    const renderFrame = useCallback(() => {
      if (USE_VIDEO_MODE) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = containerRef.current;
      if (!container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const currentFrame = currentFrameRef.current;
      const image = getFrameImage(currentFrame);
      if (!image) {
        // If we don't have an image, don't clear or draw to prevent flashing.
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const framesTotal = totalFrames || manifest.totalFrames;
      const progress = currentFrame / Math.max(1, framesTotal - 1);

      // --- 1. Compute Responsive Scale & Draw Offset ---
      const isMobile = width < 768;
      const isTablet = width >= 768 && width <= 1024;
      
      let scale = 1.0;
      let xOffsetRatio = 0.0; // Draw-level shift ratio (percentage of width)
      let yOffsetRatio = 0.0; // Draw-level shift ratio (percentage of height)

      if (isMobile) {
        // Mobile Portrait: High-impact natural product scale with guaranteed vertical clearance
        const mobileKeyframes: ScaleKeyframe[] = [
          { progress: 0.0, scale: 0.70 },
          { progress: 0.08, scale: 0.66 },
          { progress: 0.15, scale: 0.64 }, // Clean breathing room during strap separation
          { progress: 0.22, scale: 0.66 },
          { progress: 0.40, scale: 0.72 }, // Controls focus
          { progress: 0.75, scale: 0.68 }, // Audio & strap focus
          { progress: 1.0, scale: 0.72 }   // Final reveal
        ];
        scale = getInterpolatedValue(progress, mobileKeyframes);
        xOffsetRatio = 0.0;
        yOffsetRatio = 0.0;
      } else if (isTablet) {
        const isLandscape = width > height;
        if (isLandscape) {
          // Tablet Landscape
          const tabletLandscapeKeyframes: ScaleKeyframe[] = [
            { progress: 0.0, scale: 1.24 },
            { progress: 0.06, scale: 1.10 },
            { progress: 0.09, scale: 0.98 }, // Start of strap separation
            { progress: 0.15, scale: 0.98 }, // Peak separation
            { progress: 0.20, scale: 1.10 }, // End of strap separation
            { progress: 0.39, scale: 1.22 }, // Display focus
            { progress: 0.73, scale: 1.14 }, // Crown focus
            { progress: 1.0, scale: 1.28 }
          ];
          scale = getInterpolatedValue(progress, tabletLandscapeKeyframes);

          // Horizontal offset - shifted left ONLY during Scene 5 (Strap & Materiality), and RIGHT during Final Scene
          if (progress < 0.62) {
            xOffsetRatio = 0.0;
          } else if (progress >= 0.62 && progress < 0.66) {
            const t = (progress - 0.62) / 0.04;
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = -0.14 * easeT;
          } else if (progress >= 0.66 && progress <= 0.74) {
            // Scene 5 ONLY
            xOffsetRatio = -0.14;
          } else if (progress > 0.74 && progress < 0.82) {
            const t = (progress - 0.74) / 0.08;
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = -0.14 * (1 - easeT) + 0.22 * easeT;
          } else {
            // Final Scene: Move watch further to the right side
            xOffsetRatio = 0.22;
          }

          // Vertical drawing-level offset to physically center the watch during separation.
          if (progress >= 0.06 && progress < 0.09) {
            const t = (progress - 0.06) / 0.03;
            const easeT = t * t * (3 - 2 * t);
            yOffsetRatio = 0.009 * easeT;
          } else if (progress >= 0.09 && progress <= 0.15) {
            yOffsetRatio = 0.009;
          } else if (progress > 0.15 && progress < 0.20) {
            const t = (progress - 0.15) / 0.05;
            const easeT = t * t * (3 - 2 * t);
            yOffsetRatio = 0.009 * (1 - easeT);
          } else {
            yOffsetRatio = 0.0;
          }
        } else {
          // Tablet Portrait: Balanced luxury scale for portrait viewports
          const tabletPortraitKeyframes: ScaleKeyframe[] = [
            { progress: 0.0, scale: 1.48 },
            { progress: 0.06, scale: 1.32 },
            { progress: 0.09, scale: 1.20 },
            { progress: 0.15, scale: 1.20 },
            { progress: 0.20, scale: 1.32 },
            { progress: 0.39, scale: 1.46 },
            { progress: 0.73, scale: 1.34 },
            { progress: 1.0, scale: 1.50 }
          ];
          scale = getInterpolatedValue(progress, tabletPortraitKeyframes);

          // Dynamic horizontal offset for tablet portrait:
          // Scenes 1, 2, 3, 4 remain natural. Shift left ONLY for Scene 5. Shift strongly RIGHT for Final Scene.
          if (progress < 0.62) {
            xOffsetRatio = 0.0;
          } else if (progress >= 0.62 && progress < 0.66) {
            const t = (progress - 0.62) / 0.04;
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = -0.22 * easeT;
          } else if (progress >= 0.66 && progress <= 0.74) {
            // Scene 5 (05 / Strap & Materiality) ONLY - Shifted Left
            xOffsetRatio = -0.22;
          } else if (progress > 0.74 && progress < 0.82) {
            const t = (progress - 0.74) / 0.08;
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = -0.22 * (1 - easeT) + 0.28 * easeT;
          } else {
            // Final Scene: Move watch even further to the RIGHT side
            xOffsetRatio = 0.28;
          }
        }
      } else {
        // Desktop: Perfectly balanced product presence with luxury breathing room
        const desktopKeyframes: ScaleKeyframe[] = [
          { progress: 0.0, scale: 1.20 },
          { progress: 0.06, scale: 1.12 }, // Transitioning down
          { progress: 0.09, scale: 1.00 }, // Strap separation
          { progress: 0.15, scale: 1.00 }, // Peak separation
          { progress: 0.20, scale: 1.12 }, // End of strap separation
          { progress: 0.39, scale: 1.24 }, // Display & light focus
          { progress: 0.73, scale: 1.16 }, // Crown disassembly
          { progress: 1.0, scale: 1.28 }   // Bold, refined final reveal
        ];
        scale = getInterpolatedValue(progress, desktopKeyframes);

        // Horizontal drawing-level offset
        if (progress <= 0.78) {
          xOffsetRatio = 0.0;
        } else if (progress > 0.78 && progress < 0.84) {
          const t = (progress - 0.78) / 0.06;
          const easeT = t * t * (3 - 2 * t);
          xOffsetRatio = 0.18 * easeT;
        } else {
          // Final Scene: Move watch even further to right side
          xOffsetRatio = 0.18;
        }

        // Vertical drawing-level offset to physically center the watch during separation.
        if (progress >= 0.06 && progress < 0.09) {
          const t = (progress - 0.06) / 0.03;
          const easeT = t * t * (3 - 2 * t);
          yOffsetRatio = 0.009 * easeT;
        } else if (progress >= 0.09 && progress <= 0.15) {
          yOffsetRatio = 0.009;
        } else if (progress > 0.15 && progress < 0.20) {
          const t = (progress - 0.15) / 0.05;
          const easeT = t * t * (3 - 2 * t);
          yOffsetRatio = 0.009 * (1 - easeT);
        } else {
          yOffsetRatio = 0.0;
        }
      }

      // Check if anything has actually changed
      const hasFrameChanged = lastRenderedRef.current.frame !== currentFrame;
      const hasDimensionsChanged =
        lastRenderedRef.current.width !== width ||
        lastRenderedRef.current.height !== height;
      const hasImageSourceChanged =
        lastRenderedRef.current.imageSrc !== image.src;
      const hasScaleChanged = lastRenderedRef.current.scale !== scale;
      const hasOffsetChanged = lastRenderedRef.current.xOffsetRatio !== xOffsetRatio;
      const hasYOffsetChanged = lastRenderedRef.current.yOffsetRatio !== yOffsetRatio;

      if (!hasFrameChanged && !hasDimensionsChanged && !hasImageSourceChanged && !hasScaleChanged && !hasOffsetChanged && !hasYOffsetChanged) {
        return; // Skip drawing to save GPU cycles
      }

      // Ensure backing store dimensions perfectly match physical device pixels
      const targetCanvasWidth = Math.round(width * dpr);
      const targetCanvasHeight = Math.round(height * dpr);

      if (canvas.width !== targetCanvasWidth || canvas.height !== targetCanvasHeight) {
        canvas.width = targetCanvasWidth;
        canvas.height = targetCanvasHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      // Always reset transform cleanly to device pixel scale to prevent matrix accumulation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Get background color for the current frame
      const bgColor = getFrameBgColor(currentFrame);

      // Apply color to the parent container so margins blend perfectly
      container.style.backgroundColor = bgColor;

      // Clear and fill the canvas background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Calculate containment sizing dynamically matching the natural image aspect ratio
      const imageAspectRatio = image.naturalWidth && image.naturalHeight
        ? image.naturalWidth / image.naturalHeight
        : (isMobile ? 9 / 16 : 16 / 9);
      const containerAspectRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (containerAspectRatio > imageAspectRatio) {
        // Viewport is wider than image aspect ratio - bound by height
        drawWidth = height * imageAspectRatio;
        drawHeight = height;
      } else {
        // Viewport is narrower than image aspect ratio - bound by width
        drawWidth = width;
        drawHeight = width / imageAspectRatio;
      }

      // Apply dynamic scale factor
      drawWidth *= scale;
      drawHeight *= scale;

      // Center the image drawing on the canvas
      offsetX = (width - drawWidth) / 2;
      offsetY = (height - drawHeight) / 2;

      // Apply custom drawing-level horizontal shift
      if (xOffsetRatio !== 0) {
        offsetX += width * xOffsetRatio;
      }

      // Apply custom drawing-level vertical shift
      if (yOffsetRatio !== 0) {
        offsetY += height * yOffsetRatio;
      }

      // Pixel-snap coordinates to prevent sub-pixel blurriness/antialiasing softness
      const pixelOffsetX = Math.round(offsetX);
      const pixelOffsetY = Math.round(offsetY);
      const pixelDrawWidth = Math.round(drawWidth);
      const pixelDrawHeight = Math.round(drawHeight);

      // Draw frame onto canvas with maximum interpolation quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, pixelOffsetX, pixelOffsetY, pixelDrawWidth, pixelDrawHeight);

      // Cache the render parameters
      lastRenderedRef.current = {
        frame: currentFrame,
        width,
        height,
        imageSrc: image.src,
        scale,
        xOffsetRatio,
        yOffsetRatio,
      };
    }, [getFrameImage, getFrameBgColor, totalFrames]);

    const updateVideoStyles = useCallback((index: number) => {
      const container = containerRef.current;
      const video = videoRef.current;
      if (!container || !video) return;

      const totalFrames = manifest.totalFrames;
      const progress = index / (totalFrames - 1);

      // Get background color for the current frame
      const bgColor = getFrameBgColor(index);
      container.style.backgroundColor = bgColor;

      // Update video playhead position only if it has changed to prevent freezing the video decoder
      const duration = video.duration || 10.0;
      const targetTime = progress * duration;
      if (Math.abs(video.currentTime - targetTime) > 0.001) {
        video.currentTime = targetTime;
      }

      // Get cached dimensions
      const { width, height } = dimensionsRef.current;
      if (width <= 0 || height <= 0) return;

      // Calculate scale and offsets using the exact same logic
      const isMobile = width < 768;
      const isTablet = width >= 768 && width <= 1024;
      
      let scale = 1.0;
      let xOffsetRatio = 0.0;
      let yOffsetRatio = 0.0;

      if (isMobile) {
        scale = 1.18;
        xOffsetRatio = 0.0;
      } else if (isTablet) {
        const isLandscape = width > height;
        if (isLandscape) {
          const tabletLandscapeKeyframes: ScaleKeyframe[] = [
            { progress: 0.0, scale: 1.14 },
            { progress: 0.11, scale: 1.00 },
            { progress: 0.16, scale: 0.90 },
            { progress: 0.24, scale: 0.90 },
            { progress: 0.28, scale: 1.00 },
            { progress: 0.50, scale: 1.12 },
            { progress: 0.75, scale: 1.04 },
            { progress: 1.0, scale: 1.18 }
          ];
          scale = getInterpolatedValue(progress, tabletLandscapeKeyframes);

          if (progress < 0.15) {
            xOffsetRatio = 0.05;
          } else if (progress >= 0.15 && progress < 0.22) {
            const t = (progress - 0.15) / 0.07;
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = 0.05 * (1 - easeT);
          } else if (progress >= 0.22 && progress <= 0.84) {
            xOffsetRatio = 0.0;
          } else {
            const t = Math.min(Math.max((progress - 0.84) / 0.10, 0), 1);
            const easeT = t * t * (3 - 2 * t);
            xOffsetRatio = 0.05 * easeT;
          }

          if (progress >= 0.11 && progress < 0.16) {
            const t = (progress - 0.11) / 0.05;
            const easeT = t * t * (3 - 2 * t);
            yOffsetRatio = 0.009 * easeT;
          } else if (progress >= 0.16 && progress <= 0.24) {
            yOffsetRatio = 0.009;
          } else if (progress > 0.24 && progress < 0.28) {
            const t = (progress - 0.24) / 0.04;
            const easeT = t * t * (3 - 2 * t);
            yOffsetRatio = 0.009 * (1 - easeT);
          } else {
            yOffsetRatio = 0.0;
          }
        } else {
          scale = 1.28;
          xOffsetRatio = 0.0;
        }
      } else {
        const desktopKeyframes: ScaleKeyframe[] = [
          { progress: 0.0, scale: 1.14 },
          { progress: 0.11, scale: 1.00 },
          { progress: 0.16, scale: 0.88 },
          { progress: 0.24, scale: 0.88 },
          { progress: 0.28, scale: 1.00 },
          { progress: 0.50, scale: 1.10 },
          { progress: 0.75, scale: 1.02 },
          { progress: 1.0, scale: 1.16 }
        ];
        scale = getInterpolatedValue(progress, desktopKeyframes);

        if (progress < 0.15) {
          xOffsetRatio = 0.08;
        } else if (progress >= 0.15 && progress < 0.22) {
          const t = (progress - 0.15) / 0.07;
          const easeT = t * t * (3 - 2 * t);
          xOffsetRatio = 0.08 * (1 - easeT);
        } else if (progress >= 0.22 && progress <= 0.84) {
          xOffsetRatio = 0.0;
        } else {
          const t = Math.min(Math.max((progress - 0.84) / 0.10, 0), 1);
          const easeT = t * t * (3 - 2 * t);
          xOffsetRatio = 0.08 * easeT;
        }

        if (progress >= 0.11 && progress < 0.16) {
          const t = (progress - 0.11) / 0.05;
          const easeT = t * t * (3 - 2 * t);
          yOffsetRatio = 0.009 * easeT;
        } else if (progress >= 0.16 && progress <= 0.24) {
          yOffsetRatio = 0.009;
        } else if (progress > 0.24 && progress < 0.28) {
          const t = (progress - 0.24) / 0.04;
          const easeT = t * t * (3 - 2 * t);
          yOffsetRatio = 0.009 * (1 - easeT);
        } else {
          yOffsetRatio = 0.0;
        }
      }

      video.style.transform = `translate(${xOffsetRatio * width}px, ${yOffsetRatio * height}px) scale(${scale})`;
    }, [getFrameBgColor]);

    // Expose imperative handle to change frame index from the parent component
    useImperativeHandle(
      ref,
      () => ({
        updateFrame: (index: number) => {
          if (currentFrameRef.current === index) return;
          currentFrameRef.current = index;
          
          if (USE_VIDEO_MODE) {
            updateVideoStyles(index);
          } else {
            renderFrame();
          }
        },
      }),
      [renderFrame, updateVideoStyles]
    );

    // Handle re-rendering via requestAnimationFrame when refs or dimensions update
    useEffect(() => {
      if (USE_VIDEO_MODE) {
        let animId: number;
        const tick = () => {
          const { width, height } = dimensionsRef.current;
          if (width <= 0 || height <= 0) {
            const container = containerRef.current;
            if (container) {
              const rect = container.getBoundingClientRect();
              dimensionsRef.current = {
                width: Math.floor(rect.width),
                height: Math.floor(rect.height),
              };
            }
          }
          updateVideoStyles(currentFrameRef.current);
          animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
      } else {
        const animId = requestAnimationFrame(renderFrame);
        return () => cancelAnimationFrame(animId);
      }
    }, [renderFrame, updateVideoStyles]);

    // Set up ResizeObserver to trigger redraw or recalculation
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          dimensionsRef.current = { width, height };
          
          if (USE_VIDEO_MODE) {
            updateVideoStyles(currentFrameRef.current);
          } else {
            requestAnimationFrame(renderFrame);
          }
        }
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, [renderFrame, updateVideoStyles]);

    return (
      <div
        ref={containerRef}
        className={`canvas-container ${className}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          transition: "background-color 0.15s ease-out", // Smoothly transition page-canvas blend
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: USE_VIDEO_MODE ? "none" : "block",
          }}
        />
        {USE_VIDEO_MODE && (
          <video
            ref={videoRef}
            src="/assets/Watch_animation_50fps.mp4"
            muted
            playsInline
            preload="auto"
            controls={false}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              video.play().then(() => {
                video.pause();
                updateVideoStyles(currentFrameRef.current);
              }).catch((err) => {
                console.warn("Autoplay policy prevented initial video paint: ", err);
                updateVideoStyles(currentFrameRef.current);
              });
            }}
            onCanPlay={() => {
              updateVideoStyles(currentFrameRef.current);
            }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    );
  }
);

SmartwatchCanvas.displayName = "SmartwatchCanvas";
