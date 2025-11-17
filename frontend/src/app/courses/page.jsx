import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import LandingCourses from "@/components/LandingCourses";
import styles from "@/styles/landing.module.scss";

export default function CoursesPage() {
  return (
    <>
      <LandingHeader />
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead} style={{textAlign:'left'}}>
            <h2>All Courses</h2>
            <p>Browse our full catalog of subjects and programs.</p>
          </div>
        </div>
        <LandingCourses />
      </section>
      <LandingFooter />
    </>
  );
}


