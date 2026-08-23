import { useState, useEffect, useRef, useCallback } from "react";
import desktopManifest from "../../public/assets/frames/manifest.json";
import mobileManifest from "../../public/assets/frames-mobile/manifest.json";

interface ManifestData {
  manifestVersion: string;
  totalFrames: number;
  sourceFrameCount: number;
  processedFrameCount: number;
  format: string;
  width: number;
  height: number;
  aspectRatio: string;
  filenamePattern: string;
  backgroundColor: string;
  backgroundColors: string[];
  duplicatesRemoved: number;
  uniqueIndicesMap: number[];
}

const desktopManifestData = desktopManifest as unknown as ManifestData;
const mobileManifestData = mobileManifest as unknown as ManifestData;

// Parallel worker limits for fast non-blocking frame retrieval
const INITIAL_CONCURRENCY = 8;
const BACKGROUND_CONCURRENCY = 4;

function getInitialConfig(): { isMobile: boolean; manifest: ManifestData; folder: string } {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return {
    isMobile,
    manifest: isMobile ? mobileManifestData : desktopManifestData,
    folder: isMobile ? "/assets/frames-mobile" : "/assets/frames",
  };
}

export function useFramePreloader() {
  const [deviceConfig, setDeviceConfig] = useState(getInitialConfig);
  const activeManifest = deviceConfig.manifest;
  const isMobileDevice = deviceConfig.isMobile;
  const totalFrames = activeManifest.totalFrames;

  // Dynamically listen for window resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        setDeviceConfig((prev) => {
          if (prev.isMobile === isMobile) return prev;
          return {
            isMobile,
            manifest: isMobile ? mobileManifestData : desktopManifestData,
            folder: isMobile ? "/assets/frames-mobile" : "/assets/frames",
          };
        });
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Cache of loaded images: index -> HTMLImageElement
  const imageCacheRef = useRef<(HTMLImageElement | null)[]>([]);

  // Set of loaded frame indices for instant O(1) nearest-neighbor fallback resolution
  const loadedIndicesRef = useRef<Set<number>>(new Set());

  // Smooth progress updates via requestAnimationFrame
  const lastProgressRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  const updateProgress = useCallback((loaded: number, targetTotal: number) => {
    const calculatedProgress = Math.min(100, Math.round((loaded / targetTotal) * 100));

    if (calculatedProgress > lastProgressRef.current) {
      lastProgressRef.current = calculatedProgress;
      if (!animationFrameIdRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(() => {
          animationFrameIdRef.current = null;
          setProgress(lastProgressRef.current);
          setLoadedCount(loaded);
        });
      }
    }
  }, []);

  useEffect(() => {
    const chosenManifest = deviceConfig.manifest;
    const framesCount = chosenManifest.totalFrames;
    const baseFolder = deviceConfig.folder;

    // Reset cache & progress
    imageCacheRef.current = new Array(framesCount).fill(null);
    loadedIndicesRef.current.clear();
    lastProgressRef.current = 0;

    const cache = imageCacheRef.current;
    const loadedIndices = loadedIndicesRef.current;

    // Single-frame debugging mode (?frame=120)
    let forceFrame: number | null = null;
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const forceFrameParam = urlParams.get("frame");
      if (forceFrameParam !== null) {
        const parsed = parseInt(forceFrameParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < framesCount) {
          forceFrame = parsed;
        }
      }
    }

    let isAborted = false;

    // Single frame loader with non-blocking decode
    const loadFrame = async (index: number): Promise<boolean> => {
      if (isAborted) return false;
      if (cache[index]) return true;

      return new Promise<boolean>((resolve) => {
        const img = new Image();
        const filename = chosenManifest.filenamePattern.replace(
          "{index}",
          index.toString().padStart(3, "0")
        );
        img.src = `${baseFolder}/${filename}`;

        const onLoad = () => {
          if (isAborted) {
            resolve(false);
            return;
          }

          cache[index] = img;
          loadedIndices.add(index);

          // Asynchronously decode off the main thread
          if ("decode" in img) {
            img.decode().catch(() => {});
          }

          resolve(true);
        };

        const onError = () => {
          resolve(false);
        };

        img.onload = onLoad;
        img.onerror = onError;
      });
    };

    const startOptimizedPreload = async () => {
      try {
        if (forceFrame !== null) {
          await loadFrame(forceFrame);
          if (!isAborted) {
            setProgress(100);
            setLoadedCount(1);
            setIsFullyLoaded(true);
            setIsLoading(false);
          }
          return;
        }

        // 1. Build Critical Initial Buffer (~30-36 keyframes for fast ~1.5s 0-100% preloader)
        const initialBufferSet = new Set<number>();
        // First 16 frames for immediate hero animation start
        for (let i = 0; i < Math.min(16, framesCount); i++) {
          initialBufferSet.add(i);
        }
        // Keyframe timeline anchors across the full sequence (every 14 frames)
        for (let i = 16; i < framesCount; i += 14) {
          initialBufferSet.add(i);
        }
        const initialQueue = Array.from(initialBufferSet);
        const totalInitial = initialQueue.length;

        // 2. Build Remaining Frames Queue for background streaming
        const remainingQueue: number[] = [];
        for (let i = 0; i < framesCount; i++) {
          if (!initialBufferSet.has(i)) {
            remainingQueue.push(i);
          }
        }

        let completedInitial = 0;

        // Worker for initial buffer: increments progress smoothly from 0% to 100%
        const initialWorker = async () => {
          while (initialQueue.length > 0) {
            if (isAborted) return;
            const idx = initialQueue.shift();
            if (idx === undefined) break;
            await loadFrame(idx);
            completedInitial++;
            updateProgress(completedInitial, totalInitial);
          }
        };

        // Download initial keyframe buffer in parallel
        await Promise.all(
          Array.from({ length: INITIAL_CONCURRENCY }, () => initialWorker())
        );

        if (!isAborted) {
          // Guarantee progress reaches 100% cleanly
          setProgress(100);
          setLoadedCount(totalInitial);

          // Brief 200ms grace period so user sees the 100% full wave before fade-out
          setTimeout(() => {
            if (!isAborted) {
              setIsFullyLoaded(true);
              setIsLoading(false);
            }
          }, 200);

          // 3. Background streaming: stream remaining in-between frames smoothly without blocking the UI
          const backgroundWorker = async () => {
            while (remainingQueue.length > 0) {
              if (isAborted) return;
              const idx = remainingQueue.shift();
              if (idx === undefined) break;
              await loadFrame(idx);
            }
          };

          Promise.all(
            Array.from({ length: BACKGROUND_CONCURRENCY }, () => backgroundWorker())
          );
        }
      } catch (err) {
        console.warn("Preloader notice:", err);
        if (!isAborted) {
          setIsError(true);
          setIsFullyLoaded(true);
          setIsLoading(false);
        }
      }
    };

    startOptimizedPreload();

    return () => {
      isAborted = true;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [deviceConfig, updateProgress]);

  // Instant O(1) frame accessor with nearest-neighbor fallback
  const getFrameImage = useCallback((index: number): HTMLImageElement | null => {
    const framesCount = activeManifest.totalFrames;
    const targetIdx = Math.max(0, Math.min(framesCount - 1, Math.round(index)));
    const cache = imageCacheRef.current;

    if (cache[targetIdx]) {
      return cache[targetIdx];
    }

    const loadedIndices = loadedIndicesRef.current;
    if (loadedIndices.size === 0) {
      return null;
    }

    let nearestIdx = -1;
    let minDistance = Infinity;

    for (const idx of loadedIndices) {
      const dist = Math.abs(idx - targetIdx);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = idx;
      }
    }

    if (nearestIdx !== -1 && cache[nearestIdx]) {
      return cache[nearestIdx];
    }

    return null;
  }, [activeManifest]);

  // Dynamic frame background color lookup
  const getFrameBgColor = useCallback((index: number): string => {
    const framesCount = activeManifest.totalFrames;
    const targetIdx = Math.max(0, Math.min(framesCount - 1, Math.round(index)));
    return activeManifest.backgroundColors[targetIdx] || activeManifest.backgroundColor;
  }, [activeManifest]);

  return {
    progress,
    loadedCount,
    totalCount: totalFrames,
    isMobileDevice,
    isFullyLoaded,
    isLoading,
    isError,
    getFrameImage,
    getFrameBgColor,
  };
}
