import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/redux/slices/CartSlice";
import { Link } from "react-router-dom";
import styles from "@/styles/landing.module.scss";
import { apiUrl } from "@/lib/api";

export default function LandingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl("/api/courses"));
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch courses");
        setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section id="courses" className={styles.coursesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2>Popular Courses</h2>
          <p>Explore trending subjects and start learning today.</p>
        </div>
        {loading && <p className={styles.loading}>Loading courses...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <div className={styles.cards}>
            {courses.slice(0, 8).map((course) => (
              <article key={course._id || course.id} className={styles.card}>
                {course.image && <img src={course.image} alt={course.title} />}
                <div className={styles.cardBody}>
                  <h3>{course.title}</h3>
                  <p className={styles.cardMeta}>
                    <span>{course.author || "Unknown"}</span>
                    <span>{course.duration ? `${course.duration} weeks` : ""}</span>
                  </p>
                  <div className={styles.cardActions}>
                    <Link to={`/courses/${course._id || course.id}`} className={styles.detailsBtn}>
                      Details
                    </Link>
                    <button
                      className={styles.buyBtn}
                      onClick={() => {
                        dispatch(
                          addToCart({
                            id: course._id || course.id,
                            title: course.title,
                            image: course.image,
                          })
                        );
                        navigate("/checkout");
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {courses.length === 0 && <p>No courses available.</p>}
          </div>
        )}
      </div>
    </section>
  );
}


