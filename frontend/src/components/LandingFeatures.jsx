import { BookOpen, Users, Shield, LineChart, Check } from "lucide-react";
import styles from "@/styles/landing.module.scss";

export default function LandingFeatures() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2>Why Choose Us</h2>
          <p>Practical learning, real interview prep, and smart tools that help you grow.</p>
        </div>
        <ul className={styles.checkList} style={{maxWidth: 800, margin:"0 auto"}}>
          <li>✔ Beginner-friendly structured learning</li>
          <li>✔ Updated interview questions from real company experiences</li>
          <li>✔ Smart analytics to track progress</li>
          <li>✔ Mock exams that mirror real-world interviews</li>
          <li>✔ Affordable pricing for every student</li>
        </ul>
        <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:16}}>
          <a href="/courses" className={styles.primaryCta}>Explore Courses →</a>
          <a href="/courses" className={styles.secondaryCta}>Start Free Mock Test →</a>
        </div>
      </div>
    </section>
  );
}


