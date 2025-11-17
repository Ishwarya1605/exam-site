import { Link } from "react-router-dom";
import styles from "@/styles/landing.module.scss";

export default function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink} aria-label="Go to homepage">
          <img
            className={styles.logoImg}
            src="https://www.kiteztech.com/image/kitez-logo1.svg"
            alt="ExamSite"
          />
        </Link>
        <div className={styles.rightCluster}>
          <nav className={styles.nav}>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className={styles.actions}>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
            <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
          </div>
        </div>
      </div>
    </header>
  );
}


