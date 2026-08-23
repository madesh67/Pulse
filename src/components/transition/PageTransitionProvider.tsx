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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopProgressBar, TransitionStatus } from "./TopProgressBar";

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

  const contentRef = useRef<HTMLDivElement | null>(null);
  const pendingRouteRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive status update when path changes during render (React 19 recommended pattern)
  if (prevPath !== fullPath) {
    setPrevPath(fullPath);
    if (status === "navigating" || status === "exiting") {
      setStatus("entering");
    }
  }

  // Scroll reset and cleanup side-effect when entering new route
  useEffect(() => {
    if (status === "entering") {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 1, y: 0, filter: "none", clearProps: "all" });
      }

      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }

      const enterTimer = setTimeout(() => {
        setStatus("idle");
        pendingRouteRef.current = null;
      }, 350);

      return () => {
        clearTimeout(enterTimer);
      };
    }
  }, [status]);

  // Programmatic navigation with smooth minimal kinematic exit
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

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pendingRouteRef.current = href;

      if (prefersReducedMotion) {
        startTransition(() => {
          router.push(href);
        });
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return;
      }

      setStatus("exiting");

      // Safety timeout: Never lock up under any delayed navigation
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (contentRef.current) {
          gsap.set(contentRef.current, { opacity: 1, y: 0, filter: "none", clearProps: "all" });
        }
        setStatus("entering");
      }, 1200);

      // Minimalist exit dissolve
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -14,
          filter: "blur(2px)",
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            setStatus("navigating");
            startTransition(() => {
              router.push(href);
            });
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          },
        });
      } else {
        setStatus("navigating");
        startTransition(() => {
          router.push(href);
        });
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    },
    [status, router]
  );

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
          return;
        }

        // Prevent default and run minimalist transition
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
      {/* 1. Ultra-Refined Top Chronometer Hairline Progress Bar */}
      <TopProgressBar status={status} />

      {/* 2. Transitionable Page Content Wrapper */}
      <div ref={contentRef} style={{ width: "100%", minHeight: "100%" }}>
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
};
