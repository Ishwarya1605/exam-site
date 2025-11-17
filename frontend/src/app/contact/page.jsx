import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import styles from "@/styles/landing.module.scss";

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Contact Us</h2>
            <p>We’d love to hear from you.</p>
          </div>
          <form
            style={{
              maxWidth: 720,
              margin: "0 auto",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              display: "grid",
              gap: 12
            }}
            onSubmit={(e)=>e.preventDefault()}
          >
            <label className={styles.inputLabel}>Name</label>
            <input className={styles.textInput} placeholder="Your name" />
            <label className={styles.inputLabel}>Email</label>
            <input className={styles.textInput} type="email" placeholder="you@example.com" />
            <label className={styles.inputLabel}>Message</label>
            <textarea className={styles.textInput} rows={5} placeholder="How can we help?" />
            <button className={styles.primaryCta} type="submit" style={{width:"fit-content"}}>Send Message</button>
          </form>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}


