"use client";

import { useState, useEffect, useRef } from "react";
import { useFramePreloader } from "../../hooks/useFramePreloader";
import { SmartwatchCanvas, SmartwatchCanvasRef } from "../../components/SmartwatchCanvas";
import { Preloader } from "../../components/Preloader";
import styles from "../page.module.scss";

type ViewportShell = "full" | "desktop" | "tablet" | "mobile";

export default function DebugPage() {
  const {
    progress,
    loadedCount,
    totalCount,
    isFullyLoaded,
    isLoading,
    getFrameImage,
    getFrameBgColor,
  } = useFramePreloader();

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewportShell, setViewportShell] = useState<ViewportShell>("full");
  
  const canvasRef = useRef<SmartwatchCanvasRef | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameRateMs = 1000 / 24; // 24 fps play speed
  const playAnimationRef = useRef<number | null>(null);

  // Play/Pause animation loop at locked frame rate (24fps)
  useEffect(() => {
    if (!isPlaying) {
      if (playAnimationRef.current) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameRateMs) {
        lastTimeRef.current = timestamp - (elapsed % frameRateMs);
        setCurrentFrame((prev) => {
          const next = (prev + 1) % totalCount;
          canvasRef.current?.updateFrame(next);
          return next;
        });
      }

      playAnimationRef.current = requestAnimationFrame(animate);
    };

    playAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (playAnimationRef.current) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, totalCount, frameRateMs]);

  // Handle manual frame change via slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    const frame = parseInt(e.target.value, 10);
    setCurrentFrame(frame);
    canvasRef.current?.updateFrame(frame);
  };

  // Determine viewport CSS class
  let shellClass = styles.shellFull;
  if (viewportShell === "desktop") shellClass = styles.shellDesktop;
  else if (viewportShell === "tablet") shellClass = styles.shellTablet;
  else if (viewportShell === "mobile") shellClass = styles.shellMobile;

  // Retrieve current background color for seamless page-canvas blending
  const currentBgColor = isFullyLoaded ? getFrameBgColor(currentFrame) : "#f7f7f7";

  return (
    <main
      className={styles.pageWrapper}
      style={{ backgroundColor: currentBgColor }}
    >
      {/* Technical loader overlays until frames are fully loaded */}
      <Preloader
        progress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        isVisible={!isFullyLoaded}
      />

      {/* Render Canvas & Debug Panel once fully loaded */}
      {isFullyLoaded && (
        <>
          <div className={styles.viewportShellContainer}>
            <div className={shellClass}>
              <SmartwatchCanvas
                ref={canvasRef}
                getFrameImage={getFrameImage}
                getFrameBgColor={getFrameBgColor}
                initialFrame={currentFrame}
              />
            </div>
          </div>

          {/* Floating Developer Debug Console */}
          <div className={styles.consoleFloating}>
            <div className={styles.consoleHeader}>
              <h1 className={styles.consoleTitle}>
                Pulse Watch Engine
                <span className={styles.consoleBadge}>Dev Debug Console</span>
              </h1>
              <div className={styles.consoleStatusText}>
                {isLoading ? (
                  <span>Background Preloading Tier 2 ({loadedCount}/{totalCount})</span>
                ) : (
                  <span>All Assets Loaded &amp; Cached ({totalCount} frames)</span>
                )}
              </div>
            </div>

            {/* Slider scrubbing and play/pause controls */}
            <div className={styles.consoleRow}>
              <div className={styles.controlGroup}>
                <span className={styles.sliderLabel}>Scrub Frame:</span>
                <input
                  type="range"
                  min={0}
                  max={totalCount - 1}
                  value={currentFrame}
                  onChange={handleSliderChange}
                  className={styles.slider}
                />
                <span className={styles.frameNumberDisplay}>
                  {currentFrame.toString().padStart(3, "0")}
                </span>
              </div>

              {/* Playback helpers */}
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "Pause ‖" : "Play ▶"}
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrame(0);
                    canvasRef.current?.updateFrame(0);
                  }}
                >
                  First (000)
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setIsPlaying(false);
                    const mid = Math.floor(totalCount / 2);
                    setCurrentFrame(mid);
                    canvasRef.current?.updateFrame(mid);
                  }}
                >
                  Middle ({Math.floor(totalCount / 2).toString().padStart(3, "0")})
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    setIsPlaying(false);
                    const final = totalCount - 1;
                    setCurrentFrame(final);
                    canvasRef.current?.updateFrame(final);
                  }}
                >
                  Final ({totalCount - 1})
                </button>
              </div>
            </div>

            {/* Responsive shell simulator controls */}
            <div className={styles.consoleRow}>
              <div className={styles.responsiveButtons}>
                <span className={styles.responsiveLabel}>Responsive Shell:</span>
                <button
                  className={`${styles.btn} ${viewportShell === "full" ? styles.btnActive : ""}`}
                  onClick={() => setViewportShell("full")}
                >
                  Full Viewport (contain)
                </button>
                <button
                  className={`${styles.btn} ${viewportShell === "desktop" ? styles.btnActive : ""}`}
                  onClick={() => setViewportShell("desktop")}
                >
                  Desktop (1440x900)
                </button>
                <button
                  className={`${styles.btn} ${viewportShell === "tablet" ? styles.btnActive : ""}`}
                  onClick={() => setViewportShell("tablet")}
                >
                  Tablet (768x1024)
                </button>
                <button
                  className={`${styles.btn} ${viewportShell === "mobile" ? styles.btnActive : ""}`}
                  onClick={() => setViewportShell("mobile")}
                >
                  Mobile (375x667)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
