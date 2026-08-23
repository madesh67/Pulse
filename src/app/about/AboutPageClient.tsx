"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import styles from "./about.module.scss";

export const AboutPageClient: React.FC = () => {
  return (
    <main className={styles.aboutPage}>
      {/* Universal Navigation */}
      <Navigation />

      {/* 1. Hero Section: The Maison Genesis */}
      <section className={styles.heroSection} aria-labelledby="about-hero-title">
        <div className={styles.container}>
          <div className={styles.heroHeader}>
            <div className={styles.eyebrowBadge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>MAISON PULSE • EST. 2024</span>
            </div>
            <h1 id="about-hero-title" className={styles.heroTitle}>
              Where Haute Horlogerie Meets Silicon Intelligence
            </h1>
            <p className={styles.heroLead}>
              PULSE was founded upon a singular refusal: that connected timepieces
              must never be disposable gadgets. We forge heirloom instruments in
              aerospace Grade-5 titanium—uniting centuries of Swiss watchmaking
              discipline with the quiet precision of future chronometry.
            </p>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>Grade-5</span>
              <span className={styles.statLabel}>Aerospace Titanium</span>
              <span className={styles.statDetail}>Forged unibody chassis</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>0.01 mm</span>
              <span className={styles.statLabel}>CNC Machining Tolerance</span>
              <span className={styles.statDetail}>Micro-milled robotics</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Solar Atelier Power</span>
              <span className={styles.statDetail}>Zero landfill manufacturing</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>5 Years</span>
              <span className={styles.statLabel}>Atelier Warranty</span>
              <span className={styles.statDetail}>Comprehensive coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Visual Showcase Card */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseImageWrapper}>
              <Image
                src="/assets/collections/titanium-heritage.jpg"
                alt="PULSE Titanium Heritage Watch forging in atelier"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className={styles.showcaseImage}
                priority
              />
              <div className={styles.showcaseImageOverlay} />
            </div>
            <div className={styles.showcaseContent}>
              <span className={styles.cardTag}>THE ATELIER MANIFESTO</span>
              <h2 className={styles.showcaseTitle}>
                Crafted to outlast transient digital trends.
              </h2>
              <p className={styles.showcaseText}>
                Every curve, bevel, and tactile detent is calibrated to evoke the
                weight and dignity of a mechanical complication. We believe true
                luxury lies in silence—giving you essential intelligence without
                sensory overload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dual Editorial Philosophy */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>01 / CORE PHILOSOPHY</span>
            <h2 className={styles.sectionTitle}>Two Pillars of Modern Horology</h2>
          </div>

          <div className={styles.philosophyGrid}>
            {/* Pillar 1: Material Purity */}
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyImageWrapper}>
                <Image
                  src="/assets/collections/alpine-expedition.jpg"
                  alt="Aerospace Grade-5 Titanium case finishing"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className={styles.philosophyImage}
                />
              </div>
              <div className={styles.philosophyBody}>
                <span className={styles.cardIndex}>PILLAR 01</span>
                <h3 className={styles.cardHeadline}>Material Permanence</h3>
                <p className={styles.cardDescription}>
                  We machine every chassis from solid blocks of aerospace-certified
                  Grade-5 titanium (Ti-6Al-4V). Twice as strong as aluminum and 45%
                  lighter than steel, it is naturally hypoallergenic, impervious to
                  saltwater corrosion, and hand-finished with satin micro-bead blasting.
                </p>
                <ul className={styles.featurePills}>
                  <li>5-Axis CNC Milled</li>
                  <li>Grade-5 Alloy</li>
                  <li>Hypoallergenic</li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: Silent Intelligence */}
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyImageWrapper}>
                <Image
                  src="/assets/collections/stealth-obsidian.jpg"
                  alt="Silent intelligence and optical sensor array"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className={styles.philosophyImage}
                />
              </div>
              <div className={styles.philosophyBody}>
                <span className={styles.cardIndex}>PILLAR 02</span>
                <h3 className={styles.cardHeadline}>Silent Intelligence</h3>
                <p className={styles.cardDescription}>
                  Technology should serve, never intrude. Our proprietary haptic
                  engine uses linear resonant actuators tuned to deliver subtle,
                  tactile cues resembling mechanical clicks rather than buzzing
                  vibrations. Information is presented with calm restraint.
                </p>
                <ul className={styles.featurePills}>
                  <li>Sub-Micron Haptics</li>
                  <li>Glanceable UI</li>
                  <li>Zero Digital Noise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship Bento Grid */}
      <section id="craftsmanship" className={styles.craftsmanshipSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>02 / ENGINEERING ARCHITECTURE</span>
            <h2 className={styles.sectionTitle}>Precision in Every Micrometer</h2>
            <p className={styles.sectionSubtitle}>
              From raw aerospace ingot to hand-calibrated timepiece, each component
              undergoes 48 hours of robotic milling and artisanal assembly.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento Item 1: Large Feature */}
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoImageWrap}>
                <Image
                  src="/assets/collections/hydro-active.jpg"
                  alt="Monolithic unibody titanium case"
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className={styles.bentoImg}
                />
              </div>
              <div className={styles.bentoContent}>
                <span className={styles.bentoTag}>01 • UNIBODY ARCHITECTURE</span>
                <h3 className={styles.bentoTitle}>5-Axis Monolithic Milling</h3>
                <p className={styles.bentoDesc}>
                  Each casing is sculpted from a single solid titanium billet over 6
                  hours of continuous CNC routing, eliminating weak seams and achieving
                  100m depth water resistance.
                </p>
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className={styles.bentoCard}>
              <div className={styles.bentoContentOnly}>
                <span className={styles.bentoTag}>02 • OPTICAL CLARITY</span>
                <h3 className={styles.bentoTitle}>Dual-Curved Sapphire</h3>
                <p className={styles.bentoDesc}>
                  Corundum crystal with 9-layer anti-reflective vacuum deposition
                  guarantees scratch immunity and paper-like legibility under
                  intense sunlight.
                </p>
                <div className={styles.microMetric}>
                  <span className={styles.metricVal}>9 Mohs</span>
                  <span className={styles.metricDesc}>Hardness rating</span>
                </div>
              </div>
            </div>

            {/* Bento Item 3 */}
            <div className={styles.bentoCard}>
              <div className={styles.bentoContentOnly}>
                <span className={styles.bentoTag}>03 • ACOUSTIC RESONANCE</span>
                <h3 className={styles.bentoTitle}>Dual-Cavity Soundbox</h3>
                <p className={styles.bentoDesc}>
                  Micro-perforated acoustic ports coupled with an internal resonance
                  chamber deliver rich voice clarity and emergency sirens up to 86 decibels.
                </p>
                <div className={styles.microMetric}>
                  <span className={styles.metricVal}>86 dB</span>
                  <span className={styles.metricDesc}>Acoustic output</span>
                </div>
              </div>
            </div>

            {/* Bento Item 4: Wide Feature */}
            <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
              <div className={styles.bentoImageWrap}>
                <Image
                  src="/assets/offers/first-time-offer.jpg"
                  alt="Modular strap locking system"
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className={styles.bentoImg}
                />
              </div>
              <div className={styles.bentoContent}>
                <span className={styles.bentoTag}>04 • ERGONOMIC INTERFACE</span>
                <h3 className={styles.bentoTitle}>Quick-Release Modular Straps</h3>
                <p className={styles.bentoDesc}>
                  Engineered with high-density fluoroelastomer and titanium buckle
                  hardware. Interchangeable in seconds without tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Chronological Milestones Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>03 / OUR JOURNEY</span>
            <h2 className={styles.sectionTitle}>The Chronology of Innovation</h2>
          </div>

          <div className={styles.timelineList}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2024</div>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineHeading}>The Genesis Prototype</h3>
                <p className={styles.timelineText}>
                  Maison PULSE is founded in Geneva. The first monobloc titanium
                  skeleton is machined and validated through 1,000 thermal and shock
                  cycles in the Swiss Alps.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2025</div>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineHeading}>Acoustic & Sensor Integration</h3>
                <p className={styles.timelineText}>
                  Development of our proprietary dual-cavity resonant speaker and
                  bio-sensor matrix, harmonizing 2000-nit display output with 100m
                  hermetic sealing.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2026</div>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineHeading}>The Nova Pro Flagship</h3>
                <p className={styles.timelineText}>
                  Worldwide unveil of the PULSE Nova Pro flagship collection, setting
                  a new standard for modern luxury smartwatches with heirloom build
                  quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Atelier Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>04 / ATELIER COMMITMENT</span>
            <h2 className={styles.sectionTitle}>Built on Uncompromising Principles</h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Enduring Permanence</h3>
              <p className={styles.valueDesc}>
                Modular internal architecture with replaceable batteries and
                servicing support designed to keep your watch functioning for decades.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Ethical Provenance</h3>
              <p className={styles.valueDesc}>
                100% recycled rare-earth magnets, conflict-free aerospace titanium,
                and zero-plastic luxury packaging manufactured in our solar atelier.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="7"/>
                  <polyline points="12 9 12 12 13.5 13.5"/>
                  <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Haptic Restraint</h3>
              <p className={styles.valueDesc}>
                We engineer quiet technology that respects human cognitive bandwidth.
                No notification spam—only what matters, when it matters.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Master Artisanship</h3>
              <p className={styles.valueDesc}>
                Every individual timepiece is inspected under 40x optical magnification
                and individually hand-calibrated before leaving our atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Master Horologist Quote Block */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <div className={styles.quoteCard}>
            <blockquote className={styles.quoteText}>
              “A watch is the most intimate machine humanity has ever conceived.
              When it connects to the digital world, it should elevate your dignity,
              not demand your attention.”
            </blockquote>
            <div className={styles.quoteAuthor}>
              <span className={styles.authorName}>Maison PULSE Atelier</span>
              <span className={styles.authorRole}>Geneva • Zurich • Silicon Valley</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action: Explore the Collection */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaBadge}>
              <span className={styles.ctaBadgeDot} />
              <span>THE COLLECTION</span>
            </div>
            <h2 className={styles.ctaTitle}>Experience PULSE in Person</h2>
            <p className={styles.ctaDesc}>
              Discover the complete ecosystem of aerospace titanium smartwatches,
              specialist expedition editions, and modular strap systems.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/shop" className={styles.primaryCtaBtn}>
                <span>Explore The Shop</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link href="/#hero" className={styles.secondaryCtaBtn}>
                Discover Nova Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <Footer />
    </main>
  );
};
