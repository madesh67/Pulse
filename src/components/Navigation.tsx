"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { heroContent } from "../lib/heroContent";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Navigation.module.scss";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavLinkItem {
  label: string;
  href: string;
}

const NavigationLinks: React.FC<{ links: NavLinkItem[]; pathname: string }> = ({
  links,
  pathname,
}) => {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  return (
    <>
      {links.map((link) => {
        let isActive = false;
        if (link.label === "Home") {
          isActive = pathname === "/";
        } else if (link.label === "Popular") {
          isActive = (pathname === "/shop" || pathname.startsWith("/shop/")) && filterParam === "popular";
        } else if (link.label === "Shop") {
          isActive = (pathname === "/shop" || pathname.startsWith("/shop/")) && filterParam !== "popular";
        } else {
          isActive = pathname === link.href;
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
};

const NavigationLinksFallback: React.FC<{
  links: NavLinkItem[];
  pathname: string;
}> = ({ links, pathname }) => {
  return (
    <>
      {links.map((link) => {
        let isActive = false;
        if (link.label === "Home") {
          isActive = pathname === "/";
        } else if (link.label === "Shop") {
          isActive = pathname === "/shop" || pathname.startsWith("/shop/");
        } else {
          isActive = pathname === link.href;
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
};

export const Navigation: React.FC = () => {
  const { logo, product, links } = heroContent.navigation;
  const pathname = usePathname();
  const [cartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const lastScrollY = useRef(0);

  // Reset mobile menu if pathname changes during render (recommended React pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Global ScrollTrigger to track scroll direction across all sections of the page
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          // Keep navigation visible if mobile menu is open
          if (isMobileMenuOpen) {
            setIsVisible(true);
            return;
          }

          const currentScroll = self.scroll();
          const direction = self.direction; // 1 = scrolling forward/down, -1 = reverse/up

          // Threshold for header appearance at top
          if (currentScroll <= 40) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);

            // Hide when scrolling forward/down across all sections
            if (direction === 1) {
              setIsVisible(false);
            }
            // Show when reverse scrolling/up across all sections
            else if (direction === -1) {
              setIsVisible(true);
            }
          }
          lastScrollY.current = currentScroll;
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`nav-header ${styles.navContainer} ${
          isVisible || isMobileMenuOpen ? styles.navVisible : styles.navHidden
        } ${isScrolled ? styles.navScrolled : ""}`}
        aria-label="Primary Navigation"
      >
        {/* Brand Logo & Product Hierarchy */}
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.logo} aria-label="PULSE Home" onClick={() => setIsMobileMenuOpen(false)}>
            {logo}
          </Link>
          {product && <span className={styles.divider} aria-hidden="true" />}
          {product && <span className={styles.productName}>{product}</span>}
        </div>

        {/* Navigation Middle Links (Desktop & Wide Tablet) */}
        <nav className={styles.links} aria-label="Main Navigation">
          <Suspense fallback={<NavigationLinksFallback links={links} pathname={pathname} />}>
            <NavigationLinks links={links} pathname={pathname} />
          </Suspense>
        </nav>

        {/* Action Buttons: Wishlist, Cart, Account, Mobile Menu Toggle */}
        <div className={styles.actionsGroup} aria-label="User Actions">
          {/* Wishlist Button */}
          <Link
            href="/shop"
            className={styles.actionButton}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          {/* Shopping Cart Button */}
          <Link
            href="/shop"
            className={styles.actionButton}
            aria-label={cartCount > 0 ? `Shopping Cart, ${cartCount} items` : "Shopping Cart"}
            title="Cart"
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge} aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Button (Desktop & Tablet) */}
          <Link
            href="/shop"
            className={`${styles.actionButton} ${styles.accountDesktopBtn}`}
            aria-label="My Account"
            title="Account"
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={`${styles.actionButton} ${styles.mobileMenuToggle}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className={styles.actionIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`${styles.mobileDrawer} ${
          isMobileMenuOpen ? styles.mobileDrawerOpen : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={styles.drawerBackdrop}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={styles.drawerPanel}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerBrand}>{logo}</span>
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className={styles.drawerNav} aria-label="Mobile Navigation">
            {links.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${styles.drawerLink} ${
                    isActive ? styles.drawerLinkActive : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${0.05 * (idx + 1)}s` }}
                >
                  <span className={styles.drawerLinkIndex}>0{idx + 1}</span>
                  <span className={styles.drawerLinkLabel}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.drawerFooter}>
            <div className={styles.drawerActions}>
              <Link
                href="/shop"
                className={styles.drawerActionBtn}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Wishlist</span>
              </Link>
              <Link
                href="/shop"
                className={styles.drawerActionBtn}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Account</span>
              </Link>
            </div>
            <Link
              href="/#reserve"
              className={styles.drawerCta}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reserve Nova Pro
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
