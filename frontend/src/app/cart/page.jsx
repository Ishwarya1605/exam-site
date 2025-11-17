"use client";

import { useSelector, useDispatch } from "react-redux";
import styles from "@/styles/landing.module.scss";
import { removeFromCart, clearCart } from "@/redux/slices/CartSlice";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const items = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <section className={styles.coursesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHead} style={{textAlign:'left'}}>
          <h2>Your Cart</h2>
          <p>{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        {items.length === 0 ? (
          <p>No items in cart. <Link to="/">Go back</Link></p>
        ) : (
          <div className={styles.cards}>
            {items.map((it) => (
              <article key={it.id} className={styles.card}>
                {it.image && <img src={it.image} alt={it.title} />}
                <div className={styles.cardBody}>
                  <h3>{it.title}</h3>
                  <div className={styles.cardActions}>
                    <button className={styles.detailsBtn} onClick={() => navigate(`/courses/${it.id}`)}>
                      View
                    </button>
                    <button className={styles.buyBtn} onClick={() => dispatch(removeFromCart(it.id))}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div style={{display:'flex', gap:12, marginTop:16}}>
            <button className={styles.secondaryCta} onClick={() => dispatch(clearCart())}>Clear Cart</button>
            <button className={styles.primaryCta} onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </section>
  );
}


