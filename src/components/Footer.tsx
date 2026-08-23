"use client";

import React from "react";
import { footerContent } from "../lib/footerContent";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const { brand, quickLinks, services, contact, bottom } = footerContent;

  return (
    <footer className={styles.footerWrapper} aria-label="Site Footer">
      <div className={styles.container}>
        {/* 1. Main 4-Column Grid */}
        <div className={styles.mainGrid}>
          {/* Column 1: Brand & Socials */}
          <div className={styles.brandCol}>
            <a href="#" className={styles.brandLogo} aria-label={`${brand.name} Home`}>
              <svg
                className={styles.logoIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className={styles.logoText}>{brand.name}</span>
            </a>

            <p className={styles.brandDesc}>{brand.description}</p>

            <div className={styles.socialRow}>
              {/* Facebook */}
              <a
                href="#"
                className={styles.socialIconBtn}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                className={styles.socialIconBtn}
                aria-label="X (formerly Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className={styles.socialIconBtn}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className={styles.socialIconBtn}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>{quickLinks.title}</h4>
            <ul className={styles.linkList}>
              {quickLinks.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className={styles.linkItem}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className={styles.navCol}>
            <h4 className={styles.colTitle}>{services.title}</h4>
            <ul className={styles.linkList}>
              {services.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className={styles.linkItem}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>{contact.title}</h4>
            <ul className={styles.contactList}>
              {/* Address */}
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{contact.address}</span>
              </li>

              {/* Email */}
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>

              {/* Phone */}
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}>{contact.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Bottom Copyright & Legal Links Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>{bottom.copyright}</p>
          <nav className={styles.legalNav} aria-label="Legal Links">
            {bottom.legalLinks.map((item, idx) => (
              <a key={idx} href={item.href} className={styles.legalLink}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
