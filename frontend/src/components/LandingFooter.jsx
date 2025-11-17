import styles from "@/styles/landing.module.scss";

export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>ExamSite</div>
            <p>Modern exam management platform.</p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#courses">Courses</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} ExamSite. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}


