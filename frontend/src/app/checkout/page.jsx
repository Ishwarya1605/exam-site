"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "@/styles/landing.module.scss";
import { clearCart } from "@/redux/slices/CartSlice";
import { useNavigate, Link } from "react-router-dom";
import LandingHeader from "@/components/LandingHeader";

export default function CheckoutPage() {
  const items = useSelector((s) => s.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const handlePay = () => {
    dispatch(clearCart());
    alert("Payment successful! Thank you.");
    navigate("/");
  };

  return (
    <>
      <LandingHeader />
      <section className={styles.checkoutSection}>
        <div className={styles.container}>
          <div className={styles.checkoutGrid}>

            <div className={styles.leftCol}>
              {/* <div className={styles.banner}>
                <div className={styles.bannerTitle}>Your Booking is on Hold</div>
                <div className={styles.bannerText}>
                  We hold your booking until <b>Feb 14, 12:00 AM</b>. If your reserve change, we will get back to you.
                </div>
              </div> */}

              <div className={styles.panel}>
                <div className={styles.panelTitle}>User Details</div>
                {!user ? (
                  <>
                    <div className={styles.helpText}>You are not logged in.</div>
                    <Link to="/admin/login" className={styles.primaryCta}>Login to continue</Link>
                  </>
                ) : (
                  <>
                    <div className={styles.successNote}>
                      Welcome back! We’ll use your saved details for this purchase.
                    </div>
                    <div className={styles.infoGrid}>
                      <div>
                        <div className={styles.infoLabel}>Full Name</div>
                        <div className={styles.infoValue}>{user.name || user.fullName || "—"}</div>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>Email</div>
                        <div className={styles.infoValue}>{user.email || "—"}</div>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>Phone Number</div>
                        <div className={styles.infoValue}>{user.phone || "—"}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Payment Detail</div>
                <div className={styles.helpText}>Select your preferred payment method.</div>
                <div className={styles.paymentOption}>
                  <label className={styles.paymentMethodLabel}>
                    <input type="radio" name="paymentMethod" value="razorpay" defaultChecked />
                    <span>Razorpay</span>
                  </label>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Refund & Cancellation Policy</div>
                <div className={styles.policyText}>
                  Because our products are digital interview packs, mock tests, and question banks, all purchases on our platform are final and non-refundable. Once content is unlocked, it cannot be returned.
                </div>
                <Link to="/refund-policy" className={styles.policyLink}>See more details</Link>
              </div>
            </div>

            <aside className={styles.rightCol}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryTitle}>Summary</div>
                <div className={styles.summaryRow}>
                  <span>Total Items</span>
                  <b>{items.length}</b>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax</span>
                  <b>USD 0</b>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span>Total</span>
                  <b>USD {items.length * 100}.00</b>
                </div>
              </div>

              <label className={styles.termsRow}>
                <input type="checkbox" defaultChecked />
                <span>
                  By clicking this, I agree to <Link to="/refund-policy" style={{ color: "#2563eb", textDecoration: "underline" }}>Refund & Cancellation Policy</Link> and Privacy Policy
                </span>
              </label>

              <button className={styles.payBtn} disabled={items.length === 0} onClick={handlePay}>
                Pay for My Booking
              </button>

              <div className={styles.smallList}>
                {items.map((it) => (
                  <div key={it.id} className={styles.smallItem}>
                    {it.image && <img src={it.image} alt={it.title} />}
                    <span>{it.title}</span>
                  </div>
                ))}
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}


