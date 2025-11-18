"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "@/styles/landing.module.scss";
import { apiUrl } from "@/lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import LandingHeader from "@/components/LandingHeader";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/courses/${courseId}`));
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch course");
        setCourse(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchSubjectsForCourse = async () => {
      try {
        // Try a likely endpoint first
        let res = await fetch(apiUrl(`/api/subjects/course/${courseId}`));
        if (!res.ok) {
          // Fallback: fetch all and filter client-side if schema allows
          res = await fetch(apiUrl(`/api/subjects`));
          const all = await res.json();
          if (Array.isArray(all)) {
            const filtered = all.filter((s) => {
              // Common shapes: s.course === courseId OR s.course?._id === courseId OR s.courseId === courseId
              if (!s) return false;
              if (s.courseId && String(s.courseId) === String(courseId)) return true;
              if (s.course && (String(s.course) === String(courseId))) return true;
              if (s.course && s.course._id && String(s.course._id) === String(courseId)) return true;
              return false;
            });
            setSubjects(filtered);
            return;
          }
          // If not array, leave empty
          setSubjects([]);
          return;
        }
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        setSubjects([]);
      }
    };
    if (courseId) fetchSubjectsForCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(apiUrl(`/api/courses`));
        const data = await res.json();
        if (Array.isArray(data)) {
          setRelated(data.filter((c) => String(c._id || c.id) !== String(courseId)).slice(0, 3));
        }
      } catch { setRelated([]); }
    };
    fetchRelated();
  }, [courseId]);

  if (loading) return <div className={styles.container}><p className={styles.loading}>Loading course...</p></div>;
  if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  if (!course) return null;

  return (
    <>
      <LandingHeader />

      {/* Top hero with title and right pricing card */}
      <section className={styles.courseDetailHero}>
        <div className={styles.container}>
          <div className={styles.courseDetailGrid}>
            <div className={styles.courseLeft}>
              <nav className={styles.breadcrumbs}>
                <a href="/">Home</a>
                <span>›</span>
                <a href="/#courses">Courses</a>
                <span>›</span>
                <span className={styles.crumbCurrent}>{course.title}</span>
              </nav>

              <h1 className={styles.courseTitle}>{course.title}</h1>
              <p className={styles.courseSubtitle}>
                {course.description || "Learn with a structured curriculum, practical projects and expert guidance."}
              </p>
              <div className={styles.metaBadges}>
                <span className={styles.starRow}>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.star}>★</span>
                  <span className={styles.starHalf}>★</span>
                  <b>4.8</b>
                  <span className={styles.muted}>({course.members || 5747} reviews)</span>
                </span>
                <span className={styles.badge}>{course.duration ? `${course.duration} weeks` : "Self‑paced"}</span>
                <span className={styles.badge}>Certificate on completion</span>
              </div>
              {/* <button className={styles.wishlistBtn} onClick={() => alert("Added to wishlist!")}>♡ Add to Wishlist</button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main two-column area with sticky right side */}
      <section className={styles.courseMain}>
        <div className={styles.container}>
          <div className={styles.courseMainGrid}>
            <div className={styles.mainLeft}>
              {/* Overview */}
              <div className={styles.courseOverview}>
                <div className={styles.overviewGrid}>
                  <div>
                    <h2>What You’ll Learn</h2>
                    <ul className={styles.checkList}>
                      <li>Understand real interview patterns across multiple domains</li>
                      <li>Improve problem-solving and confidence through repeated practice</li>
                      <li>Practice with curated interview questions asked by top companies</li>
                      <li>Build consistency and accuracy with structured question banks</li>
                    </ul>
                  </div>
                  <div>
                    <h2>Who This Platform  is For</h2>
                    <ul className={styles.checkList}>
                      <li>Job seekers preparing for their first or next interview</li>
                      <li>Students and freshers aiming to improve interview confidence</li>
                      <li>Working professionals looking to switch careers or upskill</li>
                      <li>Anyone preparing for technical or non-technical job roles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Syllabus from Subjects */}
              <div className={styles.courseSyllabus}>
                <h2>Course Syllabus</h2>
                {subjects.length === 0 ? (
                  <p className={styles.loading}>No subjects found for this course.</p>
                ) : (
                  <div className={styles.syllabusList}>
                    {subjects.map((s, index) => (
                      <details key={s._id || s.id} className={styles.syllabusItem}>
                        <summary>
                          <span>Week {index + 1}: {s.name}</span>
                          <span className={styles.summaryMeta}>{s.level || "All Levels"}</span>
                        </summary>
                        <div className={styles.syllabusBody}>
                          <p>{s.description || "Overview coming soon."}</p>
                          <button className={styles.detailsBtn} onClick={() => navigate(`/admin/topic/${s._id || s.id}`)}>
                            View Topics
                          </button>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className={styles.faqSection}>
                <h2>Frequently Asked Questions</h2>
                <div className={styles.faqList}>
                  {[
                    {
                      q: "What is this platform about?",
                      a: "We provide online courses, interview question banks, and mock exams to help students and job seekers learn skills and crack interviews with confidence.",
                    },
                    {
                      q: "Who can use this platform?",
                      a: "Students, freshers, working professionals, and anyone preparing for technical or non-technical job interviews.",
                    },
                    {
                      q: "Are the interview questions updated?",
                      a: "Yes. We constantly update questions based on real interview experiences and industry trends.",
                    },
                    {
                      q: "Do you offer free content?",
                      a: "Yes, we offer free sample lessons and free mock tests so you can try before subscribing.",
                    },
                    {
                      q: "How do the mock exams work?",
                      a: "Mock exams simulate real interview or test environments. After completing a test, you get performance analytics and improvement suggestions.",
                    },
                    {
                      q: "Can I access the courses anytime?",
                      a: "Yes, once you enroll, you can access the courses 24/7 from any device.",
                    },
                    {
                      q: "Do you provide a certificate?",
                      a: "Yes, after completing certain courses, you will receive a completion certificate.",
                    },
                    {
                      q: "What payment methods do you support?",
                      a: "We support UPI, Credit/Debit Cards, Net Banking, and Wallet payments.",
                    },
                    {
                      q: "Can I request a refund?",
                      a: (
                        <>
                          Refunds are subject to our refund policy. Because our products are digital, purchases are generally final. However, refunds may be considered for technical issues or duplicate charges.{" "}
                          <Link to="/refund-policy" style={{ color: "#2563eb", textDecoration: "underline" }}>
                            See our Refund & Cancellation Policy for details
                          </Link>.
                        </>
                      ),
                    },
                    {
                      q: "How can I contact support?",
                      a: "You can reach us through email or our in-app support section anytime.",
                    },
                  ].map((item, i) => (
                    <details key={i} className={styles.faqItem}>
                      <summary>{item.q}</summary>
                      <div className={styles.faqBody}>{item.a}</div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Related courses */}
              <div className={styles.relatedSection}>
                <h2>Other Courses</h2>
                <div className={styles.relatedGrid}>
                  {related.map((c) => (
                    <article key={c._id || c.id} className={styles.relatedCard} onClick={() => navigate(`/courses/${c._id || c.id}`)}>
                      {c.image && <img src={c.image} alt={c.title} />}
                      <div className={styles.relatedBody}>
                        <h3>{c.title}</h3>
                        <p className={styles.cardMeta}>
                          <span>{c.subjectCount || 0} Subjects</span>
                          <span>{c.questionCount ? `${c.questionCount}+ Question Answers` : "100+ Question Answers"}</span>
                        </p>
                        <div className={styles.cardPrice}>
                          <span className={styles.priceNow}>
                            ₹{new Intl.NumberFormat('en-IN').format(c.price || 0)}
                          </span>
                          {c.compareAt && (
                            <span className={styles.priceWas}>
                              ₹{new Intl.NumberFormat('en-IN').format(c.compareAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </div>

            <aside className={styles.mainRight}>
              <div className={styles.priceCard}>
                {course.image && <img className={styles.priceCardImg} src={course.image} alt={course.title} />}
                <div className={styles.priceRow}>
                  <div className={styles.priceNow}>₹{new Intl.NumberFormat('en-IN').format(course.price || 0)}</div>
                  {course.compareAt && <div className={styles.priceWas}>₹{new Intl.NumberFormat('en-IN').format(course.compareAt)}</div>}
                </div>
                <div className={styles.smallNote}>One-time payment</div>
                <div className={styles.couponRow}>
                  <input className={styles.couponInput} placeholder="Input coupon" />
                  <button className={styles.couponBtn}>Redeem</button>
                </div>
                <div className={styles.actionsCol}>
                  <button
                    className={styles.primaryCta}
                    onClick={() => {
                      dispatch(addToCart({ id: course._id || course.id, title: course.title, image: course.image }));
                      navigate("/checkout");
                    }}
                  >
                    Enroll Now
                  </button>
                  <button className={styles.detailsBtn} onClick={() => navigate(-1)}>Back</button>
                </div>
                <div className={styles.whatsIncluded}>
                  <div className={styles.whatsTitle}>What You'll Get</div>
                  <ul>
                    <li>Access to 500+ curated interview questions and answer</li>
                    <li>3 full-length mock tests that simulate real interview and exam conditions</li>
                    <li>Performance analytics & detailed feedback after every mock test</li>
                    <li>Certification upon successful completion of the final mock test</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}


