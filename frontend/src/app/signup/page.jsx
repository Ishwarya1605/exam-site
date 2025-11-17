import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import styles from "@/styles/landing.module.scss";

export default function SignupPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Create your account</h2>
            <p>Join ExamSite to start learning.</p>
          </div>
          <form
            style={{
              maxWidth: 560,
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
            <label className={styles.inputLabel}>Full Name</label>
            <input className={styles.textInput} placeholder="John Doe" />
            <label className={styles.inputLabel}>Email</label>
            <input className={styles.textInput} type="email" placeholder="you@example.com" />
            <label className={styles.inputLabel}>Password</label>
            <input className={styles.textInput} type="password" placeholder="••••••••" />
            <button className={styles.primaryCta} type="submit" style={{width:"fit-content"}}>Sign Up</button>
          </form>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}


