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

// Optimal parallel concurrency for downloading & decoding WebP frames
const CONCURRENCY_LIMIT = 12;

function getInitialConfig(): { isMobile: boolean; manifest: ManifestData; folder: string } {
  // Mobile devices are strictly phones (< 768px). Tablets (768px - 1024px) use desktop frames.
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

  // Dynamically listen for window resize / shrink (e.g. tablet width shrinked to < 768px)
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
  const [isTier1Loaded, setIsTier1Loaded] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Cache of loaded images: index -> HTMLImageElement
  const imageCacheRef = useRef<(HTMLImageElement | null)[]>([]);

  // Set of loaded frame indices for instant O(1) fallback resolution
  const loadedIndicesRef = useRef<Set<number>>(new Set());

  // Smooth throttled progress updates
  const lastStateUpdateRef = useRef<number>(0);
  const pendingUpdateRef = useRef<{ progress: number; loaded: number } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const flushProgressUpdate = useCallback(() => {
    if (pendingUpdateRef.current) {
      setProgress(pendingUpdateRef.current.progress);
      setLoadedCount(pendingUpdateRef.current.loaded);
      pendingUpdateRef.current = null;
    }
  }, []);

  const updateProgress = useCallback((loaded: number, targetTotal: number) => {
    const calculatedProgress = Math.min(100, Math.round((loaded / targetTotal) * 100));
    const now = Date.now();

    pendingUpdateRef.current = { progress: calculatedProgress, loaded };

    if (now - lastStateUpdateRef.current > 30 || loaded === targetTotal) {
      lastStateUpdateRef.current = now;
      flushProgressUpdate();
    } else if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(() => {
        animationFrameIdRef.current = null;
        flushProgressUpdate();
      });
    }
  }, [flushProgressUpdate]);

  useEffect(() => {
    const chosenManifest = deviceConfig.manifest;
    const framesCount = chosenManifest.totalFrames;
    const baseFolder = deviceConfig.folder;

    // Initialize cache array
    imageCacheRef.current = new Array(framesCount).fill(null);
    loadedIndicesRef.current.clear();
    const cache = imageCacheRef.current;
    const loadedIndices = loadedIndicesRef.current;

    // Check for single-frame debugging mode (?frame=120)
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

    // Safe single-frame loader with non-blocking decode & silent error recovery
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

          // Asynchronously decode off the main thread to guarantee instant canvas paint
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

    const startFullPreload = async () => {
      try {
        if (forceFrame !== null) {
          await loadFrame(forceFrame);
          if (!isAborted) {
            setProgress(100);
            setLoadedCount(1);
            setIsTier1Loaded(true);
            setIsFullyLoaded(true);
            setIsLoading(false);
          }
          return;
        }

        // Tier 1: Priority Keyframes (Immediate Hero 0..12 + Every 4th Frame)
        const tier1Set = new Set<number>();
        for (let i = 0; i < Math.min(12, framesCount); i++) {
          tier1Set.add(i);
        }
        for (let i = 12; i < framesCount; i += 4) {
          tier1Set.add(i);
        }
        const tier1Queue = Array.from(tier1Set);

        // Tier 2: Remaining in-between frames
        const tier2Queue: number[] = [];
        for (let i = 0; i < framesCount; i++) {
          if (!tier1Set.has(i)) {
            tier2Queue.push(i);
          }
        }

        let completedCount = 0;

        // 1. Process Tier 1 Keyframes with high concurrency
        const workerTier1 = async () => {
          while (tier1Queue.length > 0) {
            if (isAborted) return;
            const idx = tier1Queue.shift();
            if (idx === undefined) break;
            await loadFrame(idx);
            completedCount++;
            updateProgress(completedCount, framesCount);
          }
        };

        await Promise.all(Array.from({ length: CONCURRENCY_LIMIT }, () => workerTier1()));

        if (!isAborted) {
          // Immediately unlock page rendering and user interactivity with keyframe interpolation
          setIsTier1Loaded(true);
          setIsLoading(false);
        }

        // 2. Process Tier 2 Remaining Frames in background
        const workerTier2 = async () => {
          while (tier2Queue.length > 0) {
            if (isAborted) return;
            const idx = tier2Queue.shift();
            if (idx === undefined) break;
            await loadFrame(idx);
            completedCount++;
            updateProgress(completedCount, framesCount);
          }
        };

        await Promise.all(Array.from({ length: Math.min(6, CONCURRENCY_LIMIT) }, () => workerTier2()));

        if (!isAborted) {
          setProgress(100);
          setLoadedCount(framesCount);
          flushProgressUpdate();
          setIsFullyLoaded(true);
        }
      } catch (err) {
        console.warn("Preloader notice:", err);
        if (!isAborted) {
          setIsError(true);
          setIsTier1Loaded(true);
          setIsLoading(false);
        }
      }
    };

    startFullPreload();

    return () => {
      isAborted = true;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [deviceConfig, updateProgress, flushProgressUpdate]);

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
    isTier1Loaded,
    isFullyLoaded,
    isLoading,
    isError,
    getFrameImage,
    getFrameBgColor,
  };
}
