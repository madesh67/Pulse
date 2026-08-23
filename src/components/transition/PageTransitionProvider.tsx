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
  ChronometerCurtain,
  TransitionStatus,
  TargetRouteInfo,
} from "./ChronometerCurtain";

interface PageTransitionContextType {
  status: TransitionStatus;
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
  targetInfo: TargetRouteInfo;
}

const defaultTargetInfo: TargetRouteInfo = {
  caliberCode: "CALIBER 00",
  name: "FLAGSHIP SHOWCASE",
  telemetry: "GENÈVE • 46°12'N 6°09'E • 0.01ms SYNC",
};

const PageTransitionContext = createContext<PageTransitionContextType>({
  status: "idle",
  isTransitioning: false,
  navigateTo: () => {},
  targetInfo: defaultTargetInfo,
});

export const usePageTransition = () => useContext(PageTransitionContext);

function getRouteMetadata(href: string): TargetRouteInfo {
  try {
    const url = new URL(href, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const path = url.pathname;
    const search = url.searchParams;

    if (path === "/" || path === "") {
      return {
        caliberCode: "CALIBER 00",
        name: "FLAGSHIP SHOWCASE",
        telemetry: "GENÈVE • 46°12'N 6°09'E • 0.01ms SYNC",
      };
    }

    if (path.startsWith("/about")) {
      return {
        caliberCode: "CALIBER 01",
        name: "MAISON ATELIER",
        telemetry: "MANUFACTURE D'HORLOGERIE • SWISS HERITAGE",
      };
    }

    if (path === "/shop" || path === "/shop/") {
      const filter = search.get("filter");
      const category = search.get("category");
      if (filter === "popular") {
        return {
          caliberCode: "CALIBER 02",
          name: "POPULAR CURATIONS",
          telemetry: "SELECTED EXPRESSIONS OF PULSE",
        };
      }
      if (category) {
        return {
          caliberCode: "CALIBER 02",
          name: `${category.toUpperCase()} COLLECTION`,
          telemetry: "PRECISION-ENGINEERED HOROLOGY",
        };
      }
      return {
        caliberCode: "CALIBER 02",
        name: "ATELIER CATALOGUE",
        telemetry: "20 PRECISION TIMEPIECES & ACCESSORIES",
      };
    }

    if (path.startsWith("/shop/")) {
      const slug = path.replace("/shop/", "").replace("/", "");
      const cleanName = slug
        .replace("pulse-", "")
        .replace(/-/g, " ")
        .toUpperCase();
      return {
        caliberCode: "CALIBER 03",
        name: `${cleanName} CHRONOMETER`,
        telemetry: "GRADE-5 TITANIUM • LTPO SILICON CALIBER",
      };
    }

    if (path.startsWith("/debug")) {
      return {
        caliberCode: "DIAGNOSTIC",
        name: "ENGINEERING MATRIX",
        telemetry: "FRAME RENDER INSPECTION CONSOLE",
      };
    }

    return {
      caliberCode: "CHRONOMETRY",
      name: "PRECISION NAVIGATION",
      telemetry: "PULSE ATELIER • GENÈVE",
    };
  } catch {
    return defaultTargetInfo;
  }
}

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const [prevPath, setPrevPath] = useState(fullPath);
  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [targetInfo, setTargetInfo] = useState<TargetRouteInfo>(defaultTargetInfo);

  const pendingRouteRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive status update when path changes during render (React 19 recommended pattern)
  if (prevPath !== fullPath) {
    setPrevPath(fullPath);
    if (status === "navigating" || status === "exiting") {
      setStatus("entering");
    }
  }

  // Scroll reset side-effect when entering new route
  useEffect(() => {
    if (status === "entering") {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [status]);

  // Handle programmatically initiated transitions
  const navigateTo = useCallback(
    (href: string) => {
      if (typeof window === "undefined") return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);

      // Same page and same query -> do not re-transition
      if (
        currentUrl.pathname === targetUrl.pathname &&
        currentUrl.search === targetUrl.search &&
        !targetUrl.hash
      ) {
        return;
      }

      // Hash navigation on same pathname -> let smooth scroll or native anchor take over
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

      const meta = getRouteMetadata(href);
      setTargetInfo(meta);
      pendingRouteRef.current = href;
      setStatus("exiting");

      // Safety timeout: Never leave user stuck on curtain if navigation takes too long or fails
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        console.warn("Transition safety timeout reached. Forcing enter reveal.");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setStatus("entering");
      }, 1600);
    },
    [status]
  );

  // Callback when exit curtain has covered the screen
  const handleExitComplete = useCallback(() => {
    if (!pendingRouteRef.current) {
      setStatus("idle");
      return;
    }

    setStatus("navigating");
    const nextHref = pendingRouteRef.current;

    // Execute route change
    startTransition(() => {
      router.push(nextHref);
    });

    // Reset window scroll position at route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [router]);

  // Callback when enter curtain has finished parting
  const handleEnterComplete = useCallback(() => {
    setStatus("idle");
    pendingRouteRef.current = null;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Refresh ScrollTrigger instances across the newly revealed page
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, []);

  // Global click interceptor for internal links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDocumentClick = (event: MouseEvent) => {
      // Ignore modified clicks (open in new tab / window)
      if (
        event.defaultPrevented ||
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

      // Ignore external, download, tel, mailto, target="_blank"
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      // Check if same origin
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return; // external URL
        }

        // Ignore hash only links on current page
        if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
          // Allow hash anchor scrolling
          return;
        }

        // Prevent default and run horological transition
        event.preventDefault();
        navigateTo(url.pathname + url.search + url.hash);
      } catch {
        // Fallback to default browser handling if URL parsing fails
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [navigateTo]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const meta = getRouteMetadata(window.location.pathname + window.location.search);
      setTargetInfo(meta);
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
        targetInfo,
      }}
    >
      {/* 1. Global Horological Chronometer Curtain */}
      <ChronometerCurtain
        status={status}
        targetInfo={targetInfo}
        onExitComplete={handleExitComplete}
        onEnterComplete={handleEnterComplete}
      />

      {/* 2. Page Content */}
      {children}
    </PageTransitionContext.Provider>
  );
};
