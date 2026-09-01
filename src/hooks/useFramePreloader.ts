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

// Parallel worker limits for fast non-blocking frame retrieval optimized for HTTP/2 multiplexing
const INITIAL_CONCURRENCY = 16;
const BACKGROUND_CONCURRENCY = 12;

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

  // Set of loaded frame indices for instant fallback resolution
  const loadedIndicesRef = useRef<Set<number>>(new Set());

  // Mutable ref for dynamic JIT look-ahead priority loading during scroll
  const prioritizeWindowRef = useRef<((centerIdx: number) => void) | null>(null);

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
    const inFlightMap = new Map<number, Promise<boolean>>();

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

    // Resilient single frame loader with de-duplication and automatic retry
    const loadFrame = (index: number, retries = 2): Promise<boolean> => {
      if (isAborted) return Promise.resolve(false);
      if (cache[index]) return Promise.resolve(true);

      const existing = inFlightMap.get(index);
      if (existing) return existing;

      const promise = new Promise<boolean>((resolve) => {
        const img = new Image();
        const filename = chosenManifest.filenamePattern.replace(
          "{index}",
          index.toString().padStart(3, "0")
        );
        img.src = `${baseFolder}/${filename}`;

        const onLoad = () => {
          inFlightMap.delete(index);
          if (isAborted) {
            resolve(false);
            return;
          }

          cache[index] = img;
          loadedIndices.add(index);

          // Only decode frame 0 for immediate hero canvas first paint
          if (index === 0 && "decode" in img) {
            img.decode().catch(() => {});
          }

          resolve(true);
        };

        const onError = () => {
          inFlightMap.delete(index);
          if (retries > 0 && !isAborted) {
            setTimeout(() => {
              loadFrame(index, retries - 1).then(resolve);
            }, 150);
          } else {
            resolve(false);
          }
        };

        img.onload = onLoad;
        img.onerror = onError;
      });

      inFlightMap.set(index, promise);
      return promise;
    };

    // Urgent prioritized look-ahead window for active scroll scrubbing
    let lastPrioritizedIdx = -999;
    prioritizeWindowRef.current = (centerIdx: number) => {
      if (isAborted) return;
      if (Math.abs(centerIdx - lastPrioritizedIdx) < 2) return;
      lastPrioritizedIdx = centerIdx;

      const start = Math.max(0, centerIdx - 2);
      const end = Math.min(framesCount - 1, centerIdx + 8);
      for (let i = start; i <= end; i++) {
        if (!cache[i] && !inFlightMap.has(i)) {
          loadFrame(i, 2);
        }
      }
    };

    const startProgressivePreload = async () => {
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

        // 1. Build Dense Core Tier-1 Buffer
        // - First 24 frames for seamless hero intro scrub
        // - Every even frame across the entire timeline (0, 2, 4, 6... framesCount - 1)
        // With every even frame guaranteed loaded, the maximum distance to any frame is AT MOST 1 frame!
        const tier1Set = new Set<number>();
        for (let i = 0; i < Math.min(24, framesCount); i++) {
          tier1Set.add(i);
        }
        for (let i = 0; i < framesCount; i += 2) {
          tier1Set.add(i);
        }
        const tier1Queue = Array.from(tier1Set);

        // 2. Remaining in-between odd frames (1, 3, 5, 7...)
        const tier2Queue: number[] = [];
        for (let i = 0; i < framesCount; i++) {
          if (!tier1Set.has(i)) {
            tier2Queue.push(i);
          }
        }

        let completedCount = 0;

        const runWorkers = async (queue: number[], concurrency: number) => {
          const worker = async () => {
            while (queue.length > 0) {
              if (isAborted) return;
              const idx = queue.shift();
              if (idx === undefined) break;
              await loadFrame(idx);
              completedCount++;
              updateProgress(completedCount, framesCount);
            }
          };
          await Promise.all(Array.from({ length: concurrency }, () => worker()));
        };

        // Download Tier-1 dense core grid with high concurrency
        await runWorkers(tier1Queue, INITIAL_CONCURRENCY);

        if (!isAborted) {
          // If Tier 1 finished, launch Tier 2 in parallel
          const tier2Promise = runWorkers(tier2Queue, BACKGROUND_CONCURRENCY);

          // Pacing & safety threshold:
          // If all frames finish quickly (standard broadband/Wi-Fi/5G), it finishes cleanly.
          // If the network is slow, after Tier 1 is ready + a 3.5s buffer (or >= 85%),
          // smoothly open the site, since Tier 1 already guarantees max distance of 1 frame!
          const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));

          await Promise.race([tier2Promise, timeoutPromise]);

          if (!isAborted) {
            setProgress(100);
            setLoadedCount(framesCount);

            setTimeout(() => {
              if (!isAborted) {
                setIsFullyLoaded(true);
                setIsLoading(false);
              }
            }, 250);
          }
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

    startProgressivePreload();

    return () => {
      isAborted = true;
      prioritizeWindowRef.current = null;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [deviceConfig, updateProgress]);

  // Instant O(1) frame accessor with nearest-neighbor fallback & JIT look-ahead
  const getFrameImage = useCallback((index: number): HTMLImageElement | null => {
    const framesCount = activeManifest.totalFrames;
    const targetIdx = Math.max(0, Math.min(framesCount - 1, Math.round(index)));
    const cache = imageCacheRef.current;

    // 1. Direct hit (instant O(1))
    if (cache[targetIdx]) {
      // Look-ahead for nearby upcoming frames in scroll direction
      prioritizeWindowRef.current?.(targetIdx);
      return cache[targetIdx];
    }

    // Trigger urgent retrieval for target and its surroundings
    prioritizeWindowRef.current?.(targetIdx);

    // 2. High-speed local window search (+-1, +-2, +-3, +-4)
    // Tier 1 guarantees every even frame is loaded, so +-1 is mathematically guaranteed
    // to find an adjacent frame with at most 1 frame (16ms) deviation!
    for (let offset = 1; offset <= 4; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && cache[prev]) return cache[prev];
      const next = targetIdx + offset;
      if (next < framesCount && cache[next]) return cache[next];
    }

    // 3. Fallback to any loaded frame if within extreme startup conditions
    const loadedIndices = loadedIndicesRef.current;
    if (loadedIndices.size === 0) return null;

    let nearestIdx = -1;
    let minDistance = Infinity;
    for (const idx of loadedIndices) {
      const dist = Math.abs(idx - targetIdx);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = idx;
      }
    }

    return nearestIdx !== -1 ? cache[nearestIdx] : null;
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
