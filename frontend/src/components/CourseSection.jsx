"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import CourseForm from "./courseForm";
import ErrorModal from "./ErrorModal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    setError(null); // Clear any previous errors
    const saved = await onSaveCourse(course, editingCourse);
    if (saved && !saved.error) {
      setCourses((prev) => {
        const exists = prev.some((c) => c._id === saved._id);
        if (exists) {
          return prev.map((c) => (c._id === saved._id ? saved : c));
        } else {
          return [...prev, saved];
        }
      });
      // Only close form on success
      setIsFormOpen(false);
      setEditingCourse(null);
    } else {
      // Error occurred - show error modal but keep form open
      const errorMessage = saved?.error || "Failed to save course. Please check the form and try again.";
      setError(errorMessage);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    await onDeleteCourse(course._id || course.id);
    setCourses((prev) => prev.filter((c) => c._id !== (course._id || course.id)));
  };

  const handleCourseClick = (course) => {
    const courseId = course._id || course.id;
    navigate(`/admin/subjects?courseId=${courseId}`);
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
              onClick={() => handleCourseClick(course)}
              style={{ cursor: 'pointer' }}
            >
              {course.image && <img src={course.image} alt={course.title} />}
              <h3>{course.title}</h3>
              {course.description && (
                <Tooltip title={course.description} arrow placement="top">
                  <p className={styles.courseDescription}>{course.description}</p>
                </Tooltip>
              )}
              <div className={styles.courseStudent}>
                <p
                  className={`${styles.courseLevel} ${styles[colorMap[course.level]]
                    }`}
                >
                  {course.level}
                </p>
              </div>
              <div className={styles.courseUpdate}>
                <div className={styles.courseStats}>
                  {course.subjectCount !== undefined && (
                    <p>{course.subjectCount} {course.subjectCount === 1 ? 'Subject' : 'Subjects'}</p>
                  )}
                  {course.questionCount !== undefined && (
                    <p>{course.questionCount} {course.questionCount === 1 ? 'Question' : 'Questions'}</p>
                  )}
                  {course.subjectCount === undefined && course.questionCount === undefined && course.duration && (
                    <p>{course.duration} weeks</p>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(course); }}>
                    <FaEdit />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(course); }}>
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
        <div className={styles.sidebarOverlay} onClick={handleCancel}>
          <div className={styles.sidebarCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarHeader}>
              <h2>{editingCourse ? "Edit Course" : "Add New Course"}</h2>
              <button className={styles.closeBtn} onClick={handleCancel}>×</button>
            </div>
            <div className={styles.sidebarContent}>
              <CourseForm
                onSave={handleSave}
                editingCourse={editingCourse}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}

      <ErrorModal error={error} onClose={() => setError(null)} />
    </div>
  );
}


