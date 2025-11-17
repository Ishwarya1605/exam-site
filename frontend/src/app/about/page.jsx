import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import styles from "@/styles/landing.module.scss";

export default function AboutPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>About Us</h2>
            <p>Professional & trust-building overview of our platform.</p>
          </div>
          <div style={{maxWidth:820, margin:"0 auto", color:"#475569", lineHeight:1.75, display:'grid', gap:16}}>
            <p>We are a learning platform built with one purpose — to help students and job seekers learn the right skills and crack interviews with confidence.</p>
            <p>In today’s competitive world, gaining knowledge alone is not enough. You also need real-world interview practice, exposure to commonly asked questions, and the ability to test yourself in an exam-like environment. That’s where we come in.</p>
            <h3 style={{margin:'8px 0'}}>Our Mission</h3>
            <p>To make high-quality learning and interview preparation accessible, affordable, and effective for everyone.</p>
            <h3 style={{margin:'8px 0'}}>What We Do</h3>
            <ul className={styles.checkList}>
              <li>Offer structured courses designed by experienced professionals</li>
              <li>Provide interview questions asked in real company interviews</li>
              <li>Deliver mock exams that simulate real hiring environments</li>
              <li>Track student progress and help them grow continuously</li>
            </ul>
            <h3 style={{margin:'8px 0'}}>Why We Started</h3>
            <p>We noticed thousands of learners struggle not because they lack skill, but because they lack proper guidance and interview practice. Our platform bridges that gap with simple, practical, and results-driven learning tools.</p>
            <h3 style={{margin:'8px 0'}}>Our Commitment</h3>
            <ul className={styles.checkList}>
              <li>Providing high-quality content</li>
              <li>Keeping interview questions updated</li>
              <li>Offering powerful mock exam tools</li>
              <li>Supporting every learner’s career journey</li>
            </ul>
            <h3 style={{margin:'8px 0'}}>Your Growth Is Our Priority</h3>
            <p>We believe every student deserves the chance to build a better career. With the right resources, anyone can upskill, stay confident, and secure their dream job.</p>
          </div>
        </div>
      </section>
      <LandingFooter />
    </>
  );
}


