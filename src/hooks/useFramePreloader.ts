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

// Paced parallel worker limits for stable, unhurried frame loading and GPU decoding
const CONCURRENCY_DESKTOP = 10;
const CONCURRENCY_MOBILE = 8;

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

  // Dynamically listen for window resize across mobile/desktop breakpoint
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
    setProgress(0);
    setLoadedCount(0);
    setIsFullyLoaded(false);
    setIsLoading(true);
    setIsError(false);

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

    // Resilient single frame loader with decoding and automatic retry
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

        const onLoad = async () => {
          inFlightMap.delete(index);
          if (isAborted) {
            resolve(false);
            return;
          }

          cache[index] = img;
          loadedIndices.add(index);

          // Eagerly decode every frame into GPU texture memory before marking loaded
          if ("decode" in img) {
            try {
              await img.decode();
            } catch {
              // Non-fatal: continue even if decode fails on rare platforms
            }
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
            // Frame failed after retries; resolve false to let queue continue
            resolve(false);
          }
        };

        img.onload = onLoad;
        img.onerror = onError;
      });

      inFlightMap.set(index, promise);
      return promise;
    };

    const startPreloadAllFrames = async () => {
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

        // Build complete queue of ALL frames (0 to framesCount - 1)
        const queue: number[] = [];
        for (let i = 0; i < framesCount; i++) {
          queue.push(i);
        }

        let completedCount = 0;
        const concurrency = isMobileDevice ? CONCURRENCY_MOBILE : CONCURRENCY_DESKTOP;

        const worker = async () => {
          while (queue.length > 0) {
            if (isAborted) return;
            const idx = queue.shift();
            if (idx === undefined) break;
            await loadFrame(idx);
            if (isAborted) return;
            completedCount++;
            updateProgress(completedCount, framesCount);
          }
        };

        // Guarantee ALL frames are downloaded and GPU-decoded before unlocking site
        await Promise.all(Array.from({ length: concurrency }, () => worker()));

        if (!isAborted) {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
          setProgress(100);
          setLoadedCount(framesCount);

          // Paced settling delay (500ms): lets user clearly see 100% frames loading status
          // and ensures the browser finishes all GPU composition before revealing landing page
          setTimeout(() => {
            if (!isAborted) {
              setIsFullyLoaded(true);
              setIsLoading(false);
            }
          }, 500);
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

    startPreloadAllFrames();

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

    // 1. Direct hit (instant O(1)) — guaranteed because all frames are preloaded
    if (cache[targetIdx]) {
      return cache[targetIdx];
    }

    // 2. High-speed local window search (+-1, +-2, +-3, +-4) if a frame failed to load
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
