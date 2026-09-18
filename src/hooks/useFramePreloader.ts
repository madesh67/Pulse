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

// High-throughput multiplexed parallel worker limits for modern HTTP/2 CDN
const CONCURRENCY_DESKTOP = 20;
const CONCURRENCY_MOBILE = 16;

// Target loading animation duration: 5 seconds total (4.5s smooth wave fill + 0.5s finish pause)
const TARGET_PROGRESS_DURATION_MS = 4500;
const SETTLING_DELAY_MS = 500;
const CRITICAL_HERO_FRAMES = 60;

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
        let settled = false;

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
            if (settled) return;
            settled = true;
            inFlightMap.delete(index);
            if (isAborted) {
              resolve(null);
              return;
            }

            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
              settled = false;
              handleRetry();
              return;
            }

            // Eagerly decode initial hero frames into GPU texture memory
            if (index < 45 && "decode" in img) {
              try {
                await img.decode();
              } catch {}
            }

            cache[index] = img;
            loadedIndices.add(index);
            resolve(img);
          };

          const handleRetry = () => {
            if (settled) return;
            attempt++;
            if (attempt <= maxRetries && !isAborted) {
              const delay = Math.min(800, 100 * attempt);
              setTimeout(tryLoad, delay);
            } else {
              settled = true;
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

        // Build 3-tier prioritized download list:
        // Tier 1: Dense Hero frames (0 to 60) for instant startup & initial scroll
        const tier1: number[] = [];
        for (let i = 0; i < Math.min(CRITICAL_HERO_FRAMES, framesCount); i++) {
          tier1.push(i);
        }

        // Tier 2: Timeline anchor spine across remaining sequence (every 2nd frame: 62, 64, 66...)
        const tier2: number[] = [];
        for (let i = CRITICAL_HERO_FRAMES; i < framesCount; i += 2) {
          tier2.push(i);
        }

        // Tier 3: In-between interstitial frames (61, 63, 65...)
        const tier3: number[] = [];
        for (let i = CRITICAL_HERO_FRAMES + 1; i < framesCount; i += 2) {
          tier3.push(i);
        }

        const fullQueue = [...tier1, ...tier2, ...tier3];
        const concurrency = isMobileDevice ? CONCURRENCY_MOBILE : CONCURRENCY_DESKTOP;

        let completedCount = 0;
        const worker = async () => {
          while (fullQueue.length > 0) {
            if (isAborted) return;
            const idx = fullQueue.shift();
            if (idx === undefined) break;
            const img = await loadFrame(idx);
            if (isAborted) return;
            if (img) {
              completedCount++;
              setLoadedCount(completedCount);
            }
          }
        };

        // Launch high-throughput parallel download workers
        Array.from({ length: concurrency }, () => worker());

        // Target 5-second smooth loading animation timer
        const startTime = performance.now();
        let isDone = false;

        const progressTimer = setInterval(() => {
          if (isAborted || isDone) {
            clearInterval(progressTimer);
            return;
          }

          const elapsed = performance.now() - startTime;
          const timeFrac = Math.min(1, elapsed / TARGET_PROGRESS_DURATION_MS);

          // Ease-out progress curve: 0 -> 100% over TARGET_PROGRESS_DURATION_MS (4.5s)
          const eased = 1 - Math.pow(1 - timeFrac, 1.6);
          const timeProgress = Math.round(eased * 99);

          setProgress((prev) => Math.max(prev, timeProgress));

          // At target time (4.5s), verify initial hero frame 0 is ready
          const heroReady = loadedIndices.has(0) && loadedIndices.size >= Math.min(20, framesCount);

          if (elapsed >= TARGET_PROGRESS_DURATION_MS && heroReady) {
            isDone = true;
            clearInterval(progressTimer);

            // Progress hits 100% solid black
            setProgress(100);

            // Settling delay (500ms) totaling exactly 5.0 seconds
            setTimeout(() => {
              if (!isAborted) {
                setIsFullyLoaded(true);
                setIsLoading(false);

                // Background idle decoding for subsequent frames so GPU has them ready ahead of scroll
                if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                  let nextDecodeIdx = 45;
                  const idleDecode = (deadline: IdleDeadline) => {
                    if (isAborted) return;
                    while (deadline.timeRemaining() > 6 && nextDecodeIdx < framesCount) {
                      const img = cache[nextDecodeIdx];
                      if (img && "decode" in img) {
                        img.decode().catch(() => {});
                      }
                      nextDecodeIdx++;
                    }
                    if (nextDecodeIdx < framesCount && !isAborted) {
                      (window as Window).requestIdleCallback(idleDecode);
                    }
                  };
                  (window as Window).requestIdleCallback(idleDecode);
                }
              }
            }, SETTLING_DELAY_MS);
          }
        }, 33);
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
