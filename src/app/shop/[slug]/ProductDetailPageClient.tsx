"use client";

import React, { useState, useMemo } from "react";
import { getProductDetailBySlug, ProductDetail } from "../../../lib/productDetailData";
import { shopProducts } from "../../../lib/shopProductsData";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";
import { ProductBreadcrumb } from "../../../components/pdp/ProductBreadcrumb";
import { ProductGallery } from "../../../components/pdp/ProductGallery";
import { ProductPurchasePanel } from "../../../components/pdp/ProductPurchasePanel";
import { ProductStickyBar } from "../../../components/pdp/ProductStickyBar";
import { ProductStory } from "../../../components/pdp/ProductStory";
import { ProductFeatures } from "../../../components/pdp/ProductFeatures";
import { ProductSpecs } from "../../../components/pdp/ProductSpecs";
import { ProductInTheBox } from "../../../components/pdp/ProductInTheBox";
import { ProductRelated } from "../../../components/pdp/ProductRelated";
import dynamic from "next/dynamic";
import { ProductNotFound } from "../../../components/pdp/ProductNotFound";
import styles from "./pdp.module.scss";

const ReservationModal = dynamic(
  () => import("../../../components/pdp/ReservationModal").then((mod) => mod.ReservationModal),
  { ssr: false }
);

interface ProductDetailPageClientProps {
  slug: string;
}

export const ProductDetailPageClient: React.FC<ProductDetailPageClientProps> = ({ slug }) => {
  const product: ProductDetail | undefined = useMemo(() => {
    return getProductDetailBySlug(slug);
  }, [slug]);

  // Initial variant state based on defaults
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    if (!product?.variantGroups) return {};
    const initial: Record<string, string> = {};
    product.variantGroups.forEach((group) => {
      initial[group.id] = group.defaultOptionId;
    });
    return initial;
  });

  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Calculate dynamic price including selected options (unconditional hook)
  const calculatedPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.priceValue;
    if (product.variantGroups) {
      product.variantGroups.forEach((group) => {
        const selectedOptId = selectedVariants[group.id] || group.defaultOptionId;
        const opt = group.options.find((o) => o.id === selectedOptId);
        if (opt && opt.priceDelta) {
          price += opt.priceDelta;
        }
      });
    }
    return price;
  }, [product, selectedVariants]);

  // Configuration summary text (unconditional hook)
  const configSummary = useMemo(() => {
    if (!product || !product.variantGroups || product.variantGroups.length === 0) return "";
    const parts: string[] = [];
    product.variantGroups.forEach((group) => {
      const optId = selectedVariants[group.id] || group.defaultOptionId;
      const opt = group.options.find((o) => o.id === optId);
      if (opt) parts.push(opt.label);
    });
    return parts.join(" • ");
  }, [product, selectedVariants]);

  // Related products list (unconditional hook)
  const relatedProducts = useMemo(() => {
    if (!product || !product.relatedSlugs || product.relatedSlugs.length === 0) return [];
    return shopProducts.filter((p) => product.relatedSlugs.includes(p.slug));
  }, [product]);

  // Variant change handler
  const handleVariantChange = (groupId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  if (!product) {
    return (
      <main className={styles.pdpContainer}>
        <Navigation />
        <ProductNotFound />
        <Footer />
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(calculatedPrice);

  return (
    <main className={styles.pdpContainer}>
      {/* 1. Global Navigation Bar */}
      <Navigation />

      {/* 2. Main PDP Content Boundary */}
      <div className={styles.contentBoundary}>
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumb
          categoryLabel={product.categoryLabel}
          productName={product.name}
        />

        {/* Top Hero Section: Gallery + Purchase Panel Split */}
        <section className={styles.topSection} aria-label="Product Showcase & Selection">
          <div className={styles.galleryColumn}>
            <ProductGallery
              gallery={product.gallery}
              productName={product.name}
              activeImageOverride={product.image}
            />
          </div>

          <div className={styles.purchaseColumn}>
            <ProductPurchasePanel
              product={product}
              selectedVariants={selectedVariants}
              onVariantChange={handleVariantChange}
              calculatedPrice={calculatedPrice}
              onReserveClick={() => setIsReservationOpen(true)}
            />
          </div>
        </section>

        {/* 3. Editorial Overview & Brand Story */}
        <ProductStory product={product} />

        {/* 4. Verified Key Characteristics */}
        <ProductFeatures
          features={product.features}
          productName={product.name}
        />

        {/* 5. Complete Technical Specifications Catalogue */}
        <ProductSpecs
          specifications={product.specifications}
          productName={product.name}
        />

        {/* 6. What's In The Box */}
        <ProductInTheBox
          items={product.inTheBox}
          productName={product.name}
        />

        {/* 7. Complementary Pieces / Explore More From PULSE */}
        <ProductRelated relatedProducts={relatedProducts} />
      </div>

      {/* 8. Global Maison Atelier Footer */}
      <Footer />

      {/* 9. Sticky Quick Purchase Bar */}
      <ProductStickyBar
        productName={product.name}
        price={formattedPrice}
        image={product.image}
        configSummary={configSummary}
        onReserveClick={() => setIsReservationOpen(true)}
      />

      {/* 10. Atelier Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        product={product}
        selectedVariants={selectedVariants}
        calculatedPrice={calculatedPrice}
      />
    </main>
  );
};
