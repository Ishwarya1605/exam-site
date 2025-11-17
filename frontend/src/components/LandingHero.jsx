import styles from "@/styles/landing.module.scss";

export default function LandingHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroText}>
          <h1>Master Industry-Ready Skills & Ace Every Interview</h1>
          <p>Learn top-rated courses, practice real interview questions, and test your knowledge with powerful mock exams — all in one platform.</p>
          <div className={styles.heroCtas}>
            <a href="/courses" className={styles.primaryCta}>Explore Courses →</a>
            <a href="/courses" className={styles.secondaryCta}>Start Free Mock Test →</a>
          </div>
        </div>
        <div className={styles.heroArt}>
          <img src="/assets/hero.svg" alt="ExamSite" />
        </div>
      </div>
    </section>
  );
}


