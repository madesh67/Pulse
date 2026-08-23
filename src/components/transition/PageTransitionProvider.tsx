"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SatinLouverTransition,
  TransitionStatus,
} from "./SatinLouverTransition";

interface PageTransitionContextType {
  status: TransitionStatus;
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  status: "idle",
  isTransitioning: false,
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const [prevPath, setPrevPath] = useState(fullPath);
  const [status, setStatus] = useState<TransitionStatus>("idle");

  const pendingRouteRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive status update when path changes during render (React 19 pattern)
  if (prevPath !== fullPath) {
    setPrevPath(fullPath);
    if (status === "navigating" || status === "exiting") {
      setStatus("entering");
    }
  }

  // Scroll reset side-effect when entering a new route
  useEffect(() => {
    if (status === "entering") {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }
  }, [status]);

  // Initiate transition
  const navigateTo = useCallback(
    (href: string) => {
      if (typeof window === "undefined") return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);

      // Same page and same query -> ignore
      if (
        currentUrl.pathname === targetUrl.pathname &&
        currentUrl.search === targetUrl.search &&
        !targetUrl.hash
      ) {
        return;
      }

      // Hash navigation on same pathname -> let smooth scroll take over
      if (
        currentUrl.pathname === targetUrl.pathname &&
        targetUrl.hash
      ) {
        const targetElement = document.querySelector(targetUrl.hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      if (status !== "idle") return;

      pendingRouteRef.current = href;
      setStatus("exiting");

      // Safety timeout: Reset to idle if navigation is aborted or taking too long
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setStatus("entering");
      }, 1600);
    },
    [status]
  );

  // Callback when louvers have fully veiled the screen
  const handleCoverComplete = useCallback(() => {
    if (!pendingRouteRef.current) {
      setStatus("idle");
      return;
    }

    setStatus("navigating");
    const nextHref = pendingRouteRef.current;

    startTransition(() => {
      router.push(nextHref);
    });

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [router]);

  // Callback when louvers have fully revealed the new route
  const handleRevealComplete = useCallback(() => {
    setStatus("idle");
    pendingRouteRef.current = null;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, []);

  // Global link click interceptor (capture phase to intercept before Next.js Link)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDocumentClick = (event: MouseEvent) => {
      // Ignore modified clicks (open in new tab / window)
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, download, tel, mailto, target="_blank", hash anchors
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("#")
      ) {
        return;
      }

      // Check origin
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return; // external
        }

        // Ignore same path and same query
        if (url.pathname === window.location.pathname && url.search === window.location.search && !url.hash) {
          return;
        }

        // Ignore hash on current page
        if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        navigateTo(url.pathname + url.search + url.hash);
      } catch {
        // Fallback to default browser handling
      }
    };

    // Use capture phase so we intercept before Next.js Link's internal onClick preventDefault
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [navigateTo]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setStatus("entering");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        status,
        isTransitioning: status !== "idle",
        navigateTo,
      }}
    >
      {/* 1. Architectural Satin Louver Transition */}
      <SatinLouverTransition
        status={status}
        onCoverComplete={handleCoverComplete}
        onRevealComplete={handleRevealComplete}
      />

      {/* 2. Direct clean children with zero transforms or wrappers */}
      {children}
    </PageTransitionContext.Provider>
  );
};
