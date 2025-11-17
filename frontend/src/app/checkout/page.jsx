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
              <div className={styles.banner}>
                <div className={styles.bannerTitle}>Your Booking is on Hold</div>
                <div className={styles.bannerText}>
                  We hold your booking until <b>Feb 14, 12:00 AM</b>. If your reserve change, we will get back to you.
                </div>
              </div>

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
                <div className={styles.helpText}>Please fill out the form below. Enter your card account details.</div>
                <label className={styles.inputLabel}>Card Number</label>
                <input className={styles.textInput} placeholder="1243 2133 9832 3200" />
                <div className={styles.row2}>
                  <div>
                    <label className={styles.inputLabel}>Expire Date</label>
                    <input className={styles.textInput} placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>CVC/CVV</label>
                    <input className={styles.textInput} placeholder="453" />
                  </div>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Cancelation Policy</div>
                <div className={styles.policyText}>
                  We understand plans can change unexpectedly. You have the freedom to modify or cancel your reservation
                  without incurring any cancelation fees up to 12 hours before your scheduled start.
                </div>
                <a href="#" className={styles.policyLink}>See more details</a>
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
                  By clicking this, I agree to Terms & Conditions and Privacy Policy
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


