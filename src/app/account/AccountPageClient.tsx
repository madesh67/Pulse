"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { useAccount } from "../../context";
import styles from "./account.module.scss";

type AccountTab = "overview" | "orders" | "timepieces" | "addresses" | "concierge";

export const AccountPageClient: React.FC = () => {
  const {
    user,
    orders,
    timepieces,
    addresses,
    paymentMethods,
    registerTimepiece,
    logout,
    login,
  } = useAccount();

  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [serialInput, setSerialInput] = useState("");
  const [modelInput, setModelInput] = useState("PULSE Nova Pro (Grade-5 Titanium)");
  const [registerFeedback, setRegisterFeedback] = useState<string | null>(null);

  // Concierge Form State
  const [conciergeMsg, setConciergeMsg] = useState("");
  const [conciergeSent, setConciergeSent] = useState(false);

  // Guest Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");

  const handleRegisterTimepiece = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;

    const ok = registerTimepiece(serialInput, modelInput);
    if (ok) {
      setRegisterFeedback(`Timepiece ${serialInput.toUpperCase()} successfully registered with 5-Year Atelier Warranty.`);
      setSerialInput("");
    }
  };

  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeMsg.trim()) return;
    setConciergeSent(true);
    setConciergeMsg("");
    setTimeout(() => setConciergeSent(false), 5000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    login(loginEmail, loginName);
  };

  return (
    <div className={styles.accountPage}>
      {/* 1. Global Navigation */}
      <Navigation />

      {/* 2. Main Account Portal Container */}
      <main className={styles.mainContainer}>
        {/* Header & Breadcrumb */}
        <header className={styles.pageHeader}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Patron Portal</span>
          </nav>
        </header>

        {/* If Logged In: Full Patron Dashboard */}
        {user.isLoggedIn ? (
          <>
            {/* Top Patron Profile Header Card */}
            <section className={styles.patronCard} aria-label="Patron Profile">
              <div className={styles.patronProfileLeft}>
                <div className={styles.avatarCircle}>{user.avatarInitials}</div>

                <div className={styles.patronInfo}>
                  <div className={styles.patronNameRow}>
                    <h1 className={styles.patronName}>{user.name}</h1>
                    <span className={styles.tierBadge}>{user.memberTier}</span>
                  </div>
                  <span className={styles.patronEmail}>{user.email}</span>
                  <div className={styles.patronMeta}>
                    <span>Member Since {user.memberSince}</span>
                    <span className={styles.metaDot}>&bull;</span>
                    <span>{user.patronPoints.toLocaleString()} Patron Privilege Pts</span>
                  </div>
                </div>
              </div>

              <div className={styles.patronHeaderActions}>
                <button
                  type="button"
                  className={styles.signOutBtn}
                  onClick={logout}
                  title="Sign out of patron portal"
                >
                  Sign Out
                </button>
              </div>
            </section>

            {/* Navigation Tabs */}
            <nav className={styles.tabsNav} aria-label="Account Tabs">
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders ({orders.length})
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "timepieces" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("timepieces")}
              >
                Timepiece Vault ({timepieces.length})
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                Addresses & Billing
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "concierge" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("concierge")}
              >
                Atelier Concierge
              </button>
            </nav>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Atelier Patron Privileges</h2>
                <p className={styles.sectionSubtitle}>
                  Exclusive services associated with your {user.memberTier} allocation status.
                </p>

                <div className={styles.privilegesGrid}>
                  <div className={styles.privilegeCard}>
                    <svg
                      className={styles.privilegeIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <h3 className={styles.privilegeTitle}>Priority Insured Global Dispatch</h3>
                    <p className={styles.privilegeDesc}>
                      Complimentary white-glove direct courier shipping with signature verification.
                    </p>
                  </div>

                  <div className={styles.privilegeCard}>
                    <svg
                      className={styles.privilegeIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <h3 className={styles.privilegeTitle}>5-Year International Atelier Certificate</h3>
                    <p className={styles.privilegeDesc}>
                      Extended warranty coverage on mechanical assemblies, sensor matrix, and titanium casing.
                    </p>
                  </div>

                  <div className={styles.privilegeCard}>
                    <svg
                      className={styles.privilegeIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <h3 className={styles.privilegeTitle}>Annual Ultrasonic Calibrations</h3>
                    <p className={styles.privilegeDesc}>
                      Complimentary deep cleaning, gasket replacement, and chronometer rate calibration.
                    </p>
                  </div>
                </div>

                {/* Recent Activity Snapshot */}
                <h2 className={styles.sectionTitle}>Latest Allocation</h2>
                {orders.length > 0 && (
                  <div className={styles.orderCard} style={{ marginTop: "16px" }}>
                    <div className={styles.orderCardHeader}>
                      <div className={styles.orderMetaGroup}>
                        <span className={styles.orderId}>Order #{orders[0].id}</span>
                        <span className={styles.orderDate}>{orders[0].date}</span>
                        <span className={styles.orderTotal}>${orders[0].total.toLocaleString()}</span>
                      </div>
                      <span className={`${styles.orderStatusBadge} ${styles.delivered}`}>
                        {orders[0].status}
                      </span>
                    </div>
                    <div className={styles.orderCardBody}>
                      <div className={styles.orderItemRow}>
                        <div className={styles.orderItemThumb}>
                          <Image
                            src={orders[0].items[0].image}
                            alt={orders[0].items[0].name}
                            width={64}
                            height={52}
                          />
                        </div>
                        <div className={styles.orderItemDetails}>
                          <span className={styles.orderItemName}>{orders[0].items[0].name}</span>
                          <span className={styles.orderItemVariant}>{orders[0].items[0].variant}</span>
                        </div>
                        <span className={styles.orderItemPrice}>
                          ${orders[0].items[0].price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Orders & Allocations */}
            {activeTab === "orders" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Order History & Active Telemetry</h2>
                <p className={styles.sectionSubtitle}>
                  Track your timepiece allocations and order delivery telemetry.
                </p>

                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <article key={order.id} className={styles.orderCard}>
                      <div className={styles.orderCardHeader}>
                        <div className={styles.orderMetaGroup}>
                          <span className={styles.orderId}>Order #{order.id}</span>
                          <span className={styles.orderDate}>{order.date}</span>
                          <span className={styles.orderTotal}>${order.total.toLocaleString()}</span>
                        </div>
                        <span
                          className={`${styles.orderStatusBadge} ${
                            order.status === "Delivered"
                              ? styles.delivered
                              : order.status === "In Transit"
                              ? styles.inTransit
                              : styles.assembling
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className={styles.orderCardBody}>
                        <div className={styles.orderItemsList}>
                          {order.items.map((item, idx) => (
                            <div key={idx} className={styles.orderItemRow}>
                              <div className={styles.orderItemThumb}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={52}
                                />
                              </div>
                              <div className={styles.orderItemDetails}>
                                <span className={styles.orderItemName}>{item.name}</span>
                                <span className={styles.orderItemVariant}>{item.variant}</span>
                              </div>
                              <span className={styles.orderItemPrice}>
                                ${item.price.toLocaleString()} &times; {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Tracking Box */}
                        <div className={styles.orderTrackingBox}>
                          <div className={styles.trackingInfo}>
                            <span className={styles.trackingCarrier}>{order.carrier}</span>
                            <span className={styles.trackingNumber}>Tracking: {order.trackingNumber}</span>
                            <span className={styles.deliveryEstimate}>{order.deliveryEstimate}</span>
                          </div>
                          <button
                            type="button"
                            className={styles.trackActionBtn}
                            onClick={() => alert(`Live telemetry updated for carrier ${order.carrier}`)}
                          >
                            Live Tracking
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Registered Timepiece Vault */}
            {activeTab === "timepieces" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Registered Timepiece Vault</h2>
                <p className={styles.sectionSubtitle}>
                  Authenticity certificates, chronometer calibration passports, and active warranties.
                </p>

                <div className={styles.timepieceGrid}>
                  {timepieces.map((tp) => (
                    <article key={tp.serialNumber} className={styles.timepieceCard}>
                      <div className={styles.timepieceThumb}>
                        <Image src={tp.image} alt={tp.modelName} width={120} height={100} />
                      </div>
                      <div className={styles.timepieceDetails}>
                        <h3 className={styles.timepieceName}>{tp.modelName}</h3>
                        <span className={styles.timepieceSerial}>SN: {tp.serialNumber}</span>
                        <span className={styles.timepieceWarranty}>{tp.warrantyExpiry}</span>
                        <span className={styles.timepieceCalibration}>{tp.calibrationStatus}</span>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Register New Timepiece Box */}
                <div className={styles.registerBox}>
                  <h3 className={styles.sectionTitle} style={{ fontSize: "1.1rem" }}>
                    Register a New Timepiece
                  </h3>
                  <p className={styles.sectionSubtitle} style={{ marginBottom: "12px" }}>
                    Enter the laser-engraved serial number found on the sapphire back aperture.
                  </p>

                  <form onSubmit={handleRegisterTimepiece} className={styles.registerForm}>
                    <input
                      type="text"
                      className={styles.registerInput}
                      placeholder="e.g. PLS-NP-2026-XXXX"
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                    />
                    <select
                      className={styles.registerInput}
                      value={modelInput}
                      onChange={(e) => setModelInput(e.target.value)}
                      style={{ fontFamily: "inherit" }}
                    >
                      <option value="PULSE Nova Pro (Grade-5 Titanium)">PULSE Nova Pro</option>
                      <option value="PULSE Aurora Chrono">PULSE Aurora Chrono</option>
                      <option value="PULSE Titanium Heritage">PULSE Titanium Heritage</option>
                      <option value="PULSE Monolith Ceramic">PULSE Monolith Ceramic</option>
                    </select>
                    <button type="submit" className={styles.registerBtn}>
                      Register
                    </button>
                  </form>

                  {registerFeedback && (
                    <p style={{ marginTop: "12px", color: "#2e7d32", fontSize: "0.8rem", fontWeight: 600 }}>
                      {registerFeedback}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Addresses & Billing */}
            {activeTab === "addresses" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Saved Atelier Delivery Addresses</h2>
                <p className={styles.sectionSubtitle}>
                  Locations configured for priority white-glove signature delivery.
                </p>

                <div className={styles.addressGrid}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`${styles.addressCard} ${addr.isDefault ? styles.defaultAddress : ""}`}
                    >
                      <div className={styles.addressLabelRow}>
                        <span className={styles.addressType}>{addr.label}</span>
                        {addr.isDefault && <span className={styles.defaultTag}>Default</span>}
                      </div>
                      <span className={styles.addressLine} style={{ fontWeight: 600 }}>
                        {addr.name}
                      </span>
                      <span className={styles.addressLine}>
                        {addr.street} {addr.suite ? `, ${addr.suite}` : ""}
                      </span>
                      <span className={styles.addressLine}>
                        {addr.city}, {addr.state} {addr.zip}, {addr.country}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Payment Methods */}
                <h2 className={styles.sectionTitle}>Stored Payment Privileges</h2>
                <div className={styles.addressGrid}>
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className={styles.addressCard}>
                      <div className={styles.addressLabelRow}>
                        <span className={styles.addressType}>{pm.brand}</span>
                        {pm.isDefault && <span className={styles.defaultTag}>Default</span>}
                      </div>
                      <span className={styles.addressLine}>
                        {pm.brand === "Apple Pay" ? "Apple Pay Express Checkout" : `•••• •••• •••• ${pm.last4}`}
                      </span>
                      <span className={styles.addressLine} style={{ fontSize: "0.75rem", color: "#888" }}>
                        Expires: {pm.expiry} &bull; Cardholder: {pm.holderName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Atelier Concierge */}
            {activeTab === "concierge" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Private Atelier Concierge</h2>
                <p className={styles.sectionSubtitle}>
                  Direct direct communication with your dedicated Swiss horology concierge.
                </p>

                <div className={styles.conciergeCard}>
                  <form onSubmit={handleConciergeSubmit} className={styles.conciergeForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="inquiryType">Inquiry Subject</label>
                      <select id="inquiryType" defaultValue="Bespoke Engraving Request">
                        <option value="Bespoke Engraving Request">Bespoke Laser Engraving Request</option>
                        <option value="Custom Strap Sizing">Custom Strap Sizing & Fitting</option>
                        <option value="Atelier Salon Booking">Private Geneva / NY Atelier Salon Visit</option>
                        <option value="Specialist Edition Allocation">Specialist Edition Priority Allocation</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="conciergeMessage">Your Message to Concierge</label>
                      <textarea
                        id="conciergeMessage"
                        rows={5}
                        placeholder="Please describe your bespoke requirements, preferred engraving typography, or preferred consultation date..."
                        value={conciergeMsg}
                        onChange={(e) => setConciergeMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className={styles.conciergeSubmitBtn}>
                      Transmit to Concierge &rarr;
                    </button>

                    {conciergeSent && (
                      <p style={{ color: "#2e7d32", fontSize: "0.85rem", fontWeight: 600, marginTop: "8px" }}>
                        Your inquiry has been assigned to Atelier Concierge Desk. You will receive a direct
                        response within 2 business hours.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Guest / Logged Out View */
          <div className={styles.loginPortalContainer}>
            <div className={styles.loginIconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className={styles.loginTitle}>Patron Portal Access</h1>
            <p className={styles.loginSubtitle}>
              Sign in to manage your timepieces, order allocations, and private concierge privileges.
            </p>

            <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="loginNameInput">Full Name</label>
                <input
                  id="loginNameInput"
                  type="text"
                  placeholder="Julian Vane"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="loginEmailInput">Email Address</label>
                <input
                  id="loginEmailInput"
                  type="email"
                  placeholder="patron@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.loginSubmitBtn}>
                Sign In to Atelier &rarr;
              </button>
            </form>

            <button
              type="button"
              className={styles.quickTestLoginBtn}
              onClick={() => login("julian.vane@atelier-pulse.com", "Julian Vane")}
            >
              Sign In as VIP Patron (Instant Access)
            </button>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
