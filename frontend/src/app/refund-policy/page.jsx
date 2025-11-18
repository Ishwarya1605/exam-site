"use client";

import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import styles from "@/styles/landing.module.scss";

export default function RefundPolicyPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.courseOverview}>
        <div className={styles.container}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "8px", color: "#0f172a" }}>
              Refund & Cancellation Policy
            </h1>
            <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#374151", lineHeight: "1.7", marginBottom: "24px" }}>
                Because our products are digital interview packs, mock tests, and question banks, all purchases on our platform are final and non-refundable.
              </p>

              <p style={{ color: "#374151", lineHeight: "1.7", marginBottom: "24px" }}>
                Once the content or mock tests are unlocked in your account, the product is considered delivered and cannot be returned.
              </p>

              <h2 style={{ fontSize: "20px", marginTop: "32px", marginBottom: "16px", color: "#0f172a" }}>
                However, refunds may be considered only under the following conditions:
              </h2>

              <h3 style={{ fontSize: "18px", marginTop: "24px", marginBottom: "12px", color: "#0f172a" }}>
                You may request a refund if:
              </h3>

              <ul className={styles.checkList} style={{ marginBottom: "24px" }}>
                <li>You were charged twice for the same order.</li>
                <li>You paid but the product was not unlocked due to a technical issue.</li>
                <li>The payment was debited but marked as failed.</li>
              </ul>

              <p style={{ color: "#374151", lineHeight: "1.7", marginBottom: "24px" }}>
                In such cases, contact our support team within 48 hours with payment proof.
              </p>

              <h3 style={{ fontSize: "18px", marginTop: "24px", marginBottom: "12px", color: "#0f172a" }}>
                No refund will be provided if:
              </h3>

              <ul className={styles.checkList} style={{ marginBottom: "24px" }}>
                <li>You purchased the interview pack or mock tests by mistake.</li>
                <li>You changed your mind after accessing the content.</li>
                <li>You completed or partially completed mock tests.</li>
                <li>You want a refund after using the question bank.</li>
              </ul>

              <p style={{ color: "#374151", lineHeight: "1.7", marginTop: "24px" }}>
                We aim to provide transparent and fair policies while ensuring the safety of digital products.
              </p>
            </div>

            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <a href="/" className={styles.primaryCta} style={{ display: "inline-block" }}>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}

