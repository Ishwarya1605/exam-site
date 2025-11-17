import styles from "@/styles/landing.module.scss";

export default function LandingOffer() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2>What We Offer</h2>
          <p>Learn, practice, and prove your skills — all in one place.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📚</div>
            <h3>Expert-Designed Courses</h3>
            <p>Upskill with structured, easy-to-understand lessons created by industry professionals. Each course is designed to take you from beginner to job-ready.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>❓</div>
            <h3>Real Interview Questions</h3>
            <p>Access curated interview questions asked by top companies. Prepare confidently with role-specific, topic-wise, and difficulty-based question sets.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📝</div>
            <h3>Mock Exams for Job Preparation</h3>
            <p>Take interactive mock exams that simulate real interview pressure. Track your progress, identify weak areas, and improve smarter.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Personalized Learning Path</h3>
            <p>Get recommendations for courses, interview questions, and mock tests based on your goals and performance.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Built for Students & Job Seekers</h3>
            <p>Whether you're learning a new skill or preparing for your next job interview, our platform helps you learn, practice, and succeed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}



