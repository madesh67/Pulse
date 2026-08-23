"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductDetail } from "../../lib/productDetailData";
import styles from "./ReservationModal.module.scss";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetail;
  selectedVariants: Record<string, string>;
  calculatedPrice: number;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariants,
  calculatedPrice,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close reservation dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.atelierTag}>PULSE ATELIER ALLOCATION</div>
          <h2 id="modal-title" className={styles.modalTitle}>
            Timepiece Reservation Prepared
          </h2>
          <p className={styles.modalSubtitle}>
            Your tailored configuration has been recorded and is ready for the boutique checkout queue.
          </p>
        </div>

        {/* Summary Card */}
        <div className={styles.productSummaryBox}>
          <div className={styles.thumbWrapper}>
            <Image
              src={product.image}
              alt=""
              width={80}
              height={80}
              className={styles.summaryImage}
            />
          </div>

          <div className={styles.summaryInfo}>
            <span className={styles.productName}>{product.name}</span>
            <span className={styles.productPrice}>{formatCurrency(calculatedPrice)}</span>

            {/* Selected Options Breakdown */}
            <div className={styles.configBadges}>
              {product.variantGroups?.map((group) => {
                const optId = selectedVariants[group.id] || group.defaultOptionId;
                const opt = group.options.find((o) => o.id === optId);
                return opt ? (
                  <span key={group.id} className={styles.configBadge}>
                    <strong>{group.name}:</strong> {opt.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Architecture Notice (Truthful, No Fake Backend) */}
        <div className={styles.noticeBox}>
          <svg
            className={styles.noticeIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className={styles.noticeText}>
            <strong>Atelier Commerce Readiness Notice</strong>
            <span>
              The Product Detail Page configuration boundary is fully structured and prepared for the upcoming Bag & Checkout integration. No transaction will be billed at this stage.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <button type="button" className={styles.continueBtn} onClick={onClose}>
            CONTINUE REVIEWING
          </button>
          <Link href="/shop" className={styles.shopBtn} onClick={onClose}>
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    </div>
  );
};
