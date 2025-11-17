"use client";

import { useState, useEffect } from "react";
import CourseForm from "./courseForm";
import { FaTrash, FaEdit, FaSearch, FaUsers } from "react-icons/fa";
import styles from "../styles/Course.module.scss";

export default function CourseSection({
  initialCourses = [],
  onSaveCourse,
  onDeleteCourse,
}) {
  const [courses, setCourses] = useState(initialCourses || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (courses.length === 0 && initialCourses.length > 0) {
      setCourses(initialCourses);
    }
  }, [initialCourses]);

  const openModal = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setIsFormOpen(false);
  };



  const handleSave = async (course) => {
    const saved = await onSaveCourse(course, editingCourse);
    if (saved) {
      setCourses((prev) => {
        const exists = prev.some((c) => c._id === saved._id);
        if (exists) {

          return prev.map((c) => (c._id === saved._id ? saved : c));
        } else {

          return [...prev, saved];
        }
      });
    }
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    await onDeleteCourse(course._id || course.id);
    setCourses((prev) => prev.filter((c) => c._id !== (course._id || course.id)));
  };

  const colorMap = {
    Beginner: "beginner",
    Intermediate: "intermediate",
    Advanced: "advanced",
  };

  const filteredCourses = courses
    .filter((c) => c && c.title)
    .filter((c) => c.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className={styles.courseModule}>
      <div className={styles.courseHeading}>
        <div>
          <h1>Courses Management</h1>
          <p>View, add, and organize all available courses.</p>
        </div>
        <div>
          <button className={styles.createBtn} onClick={openModal}>
            + Add Course
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterWrapper}>
          <FaSearch className={styles.filterIcon} />
          <input
            type="text"
            placeholder="Search courses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {filteredCourses.length > 0 ? (

          Array.from(
            new Map(filteredCourses.map((c) => [c._id || c.id, c])).values()
          ).map((course) => (
            <div
              key={course._id || course.id}
              className={styles.courseCard}
            >
              {course.image && <img src={course.image} alt={course.title} />}
              <h3>{course.title}</h3>
              <p>{course.author}</p>
              <div className={styles.courseStudent}>
                <p>
                  <FaUsers /> {course.students} Students
                </p>
                <p
                  className={`${styles.courseLevel} ${styles[colorMap[course.level]]
                    }`}
                >
                  {course.level}
                </p>
              </div>
              <div className={styles.courseUpdate}>
                <div>
                  <p>{course.duration} weeks</p>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(course)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(course)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <CourseForm
              onSave={handleSave}
              editingCourse={editingCourse}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}


