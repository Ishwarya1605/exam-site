import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import LoginForm from "@/components/LoginForm";
import styles from "@/styles/landing.module.scss";

export default function PublicLoginPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Login</h2>
            <p>Access your account to continue.</p>
          </div>
          <div style={{maxWidth: 560, margin:"0 auto"}}>
            <LoginForm />
          </div>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}


