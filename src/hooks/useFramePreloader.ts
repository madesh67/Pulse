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

// Controlled, steady worker concurrency so frames load thoroughly without rushing
const CONCURRENCY_DESKTOP = 4;
const CONCURRENCY_MOBILE = 3;

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

  // Immediately synchronize mobile/desktop breakpoint on client mount and resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      setDeviceConfig((prev) => {
        if (prev.isMobile === isMobile) return prev;
        return {
          isMobile,
          manifest: isMobile ? mobileManifestData : desktopManifestData,
          folder: isMobile ? "/assets/frames-mobile" : "/assets/frames",
        };
      });
    };

    // Check immediately on mount
    checkDevice();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkDevice, 200);
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
    const inFlightMap = new Map<number, Promise<HTMLImageElement | null>>();

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

    // Resilient frame loader: attaches handlers before src, decodes off-thread, retries reliably
    const loadFrame = (index: number, maxRetries = 5): Promise<HTMLImageElement | null> => {
      if (isAborted) return Promise.resolve(null);
      if (cache[index] && cache[index]!.complete && cache[index]!.naturalWidth > 0) {
        return Promise.resolve(cache[index]);
      }

      const existing = inFlightMap.get(index);
      if (existing) return existing;

      const promise = new Promise<HTMLImageElement | null>((resolve) => {
        let attempt = 0;

        const tryLoad = () => {
          if (isAborted) {
            inFlightMap.delete(index);
            resolve(null);
            return;
          }

          const img = new Image();
          const filename = chosenManifest.filenamePattern.replace(
            "{index}",
            index.toString().padStart(3, "0")
          );
          const fullSrc = `${baseFolder}/${filename}`;

          const handleSuccess = async () => {
            inFlightMap.delete(index);
            if (isAborted) {
              resolve(null);
              return;
            }

            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
              handleRetry();
              return;
            }

            // Eagerly decompress and rasterize into GPU texture memory
            if ("decode" in img) {
              try {
                await img.decode();
              } catch {
                // Non-fatal fallback
              }
            }

            cache[index] = img;
            loadedIndices.add(index);
            resolve(img);
          };

          const handleRetry = () => {
            attempt++;
            if (attempt <= maxRetries && !isAborted) {
              const delay = Math.min(1000, 150 * attempt);
              setTimeout(tryLoad, delay);
            } else {
              inFlightMap.delete(index);
              resolve(null);
            }
          };

          // Always set handlers before src to guarantee capture on cached images
          img.onload = handleSuccess;
          img.onerror = handleRetry;
          img.src = fullSrc;

          if (img.complete && img.naturalWidth > 0) {
            handleSuccess();
          }
        };

        tryLoad();
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

        // Build complete sequential queue of ALL frames (0 to framesCount - 1)
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
            const img = await loadFrame(idx);
            if (isAborted) return;
            if (img) {
              completedCount++;
              updateProgress(completedCount, framesCount);
            } else {
              // If frame failed all retries, push back to end of queue to re-try
              queue.push(idx);
            }
          }
        };

        // Step 1: Process full queue through steady workers
        await Promise.all(Array.from({ length: concurrency }, () => worker()));

        if (isAborted) return;

        // Step 2: Strict 100% verification pass — ensure EVERY SINGLE frame is loaded and valid
        for (let i = 0; i < framesCount; i++) {
          if (isAborted) return;
          if (!cache[i] || !cache[i]!.complete || cache[i]!.naturalWidth === 0) {
            await loadFrame(i, 5);
          }
        }

        if (isAborted) return;

        // Step 3: Verify initial frame 0 is decoded and ready for first paint
        if (cache[0] && "decode" in cache[0]!) {
          try {
            await cache[0]!.decode();
          } catch {}
        }

        if (!isAborted) {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
          setProgress(100);
          setLoadedCount(framesCount);

          // Paced settling delay (700ms): ensures user clearly sees 100% completion
          // and allows the browser to finalize GPU memory before unlocking the page
          setTimeout(() => {
            if (!isAborted) {
              setIsFullyLoaded(true);
              setIsLoading(false);
            }
          }, 700);
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
