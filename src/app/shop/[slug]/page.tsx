import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProductSlugs, getProductDetailBySlug } from "../../../lib/productDetailData";
import { ProductDetailPageClient } from "./ProductDetailPageClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PULSE Atelier",
      description: "The requested PULSE timepiece or accessory could not be found.",
    };
  }

  return {
    title: `${product.name} | PULSE Atelier Horology`,
    description: product.descriptor,
    openGraph: {
      title: `${product.name} — ${product.price} | PULSE`,
      description: product.descriptor,
      images: [
        {
          url: product.image,
          alt: product.imageAlt || product.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.image,
        description: product.descriptor,
        brand: {
          "@type": "Brand",
          name: "PULSE",
        },
        material: product.material,
        offers: {
          "@type": "Offer",
          price: product.priceValue,
          priceCurrency: "USD",
          availability: product.availability.toLowerCase().includes("in stock")
            ? "https://schema.org/InStock"
            : "https://schema.org/LimitedAvailability",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }} />}>
        <ProductDetailPageClient slug={slug} />
      </Suspense>
    </>
  );
}
