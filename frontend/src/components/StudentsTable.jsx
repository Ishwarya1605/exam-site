"use client";

import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaAngleLeft,
  FaAngleRight,
  FaKey,
  FaTimes,
} from "react-icons/fa";
import { apiUrl } from "../lib/api";
import styles from "../styles/Students.module.scss";

export default function StudentsTable({
  students,
  onUpdate,
  onDelete,
  searchTerm,
  setSearchTerm,
  toggleSort,
  currentPage,
  totalPages,
  goPrev,
  goNext,
  getPageNumbers,
  setCurrentPage,
  onRefresh,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    purchasedCourses: [],
    mockInterviewsAvailable: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStudentId, setPasswordStudentId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(apiUrl("/api/courses"));
        const data = await res.json();
        if (Array.isArray(data)) setAllCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const startEdit = (student) => {
    setEditingId(student._id || student.id);
    setEditData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      purchasedCourses: student.purchasedCourses || [],
      mockInterviewsAvailable: student.mockInterviewsAvailable || 0,
    });
    setIsSidebarOpen(true);
  };

  const openPasswordModal = (studentId) => {
    setPasswordStudentId(studentId);
    setNewPassword("");
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordStudentId(null);
    setNewPassword("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/students/student/${passwordStudentId}/password`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) throw new Error("Failed to update password");
      
      alert("Password updated successfully");
      closePasswordModal();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourseToAdd) return;

    try {
      const res = await fetch(apiUrl(`/api/students/student/${editingId}/courses`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourseToAdd }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add course");
      }

      const updated = await res.json();
      setEditData({
        ...editData,
        purchasedCourses: updated.purchasedCourses || [],
      });
      setSelectedCourseToAdd("");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add course");
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      const res = await fetch(apiUrl(`/api/students/student/${editingId}/courses`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Failed to remove course");

      const updated = await res.json();
      setEditData({
        ...editData,
        purchasedCourses: updated.purchasedCourses || [],
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to remove course");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsSidebarOpen(false);
    setEditData({ 
      name: "", 
      email: "", 
      phone: "",
      purchasedCourses: [],
      mockInterviewsAvailable: 0,
    });
    setSelectedCourseToAdd("");
  };

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editData.name.trim() || !editData.email.trim() || !editData.phone.trim()) {
      return;
    }
    await onUpdate(editingId, {
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      mockInterviewsAvailable: editData.mockInterviewsAvailable,
    });
    cancelEdit();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className={styles.studentPage}>
      <h1>Students List</h1>

      <div className={styles.controls}>
        <div className={styles.filterWrapper}>
          <FaSearch className={styles.filterIcon} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <button onClick={toggleSort}>
            <FaFilter /> Sort
          </button>
      </div>
      <div className="studentTableContainer">
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Purchased Courses</th>
              <th>Mock Interviews</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    <div className={styles.coursesList}>
                      {student.purchasedCourses && student.purchasedCourses.length > 0 ? (
                        <div className={styles.coursesContainer}>
                          {student.purchasedCourses.slice(0, 2).map((course, idx) => (
                            <div key={idx} className={styles.courseBadge}>
                              <span className={styles.courseTitle}>
                                {course.courseTitle || course.courseId?.title || "Course"}
                              </span>
                              <span className={styles.courseDate}>
                                {formatDate(course.purchasedDate)}
                              </span>
                            </div>
                          ))}
                          {student.purchasedCourses.length > 2 && (
                            <span className={styles.moreCourses}>
                              +{student.purchasedCourses.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={styles.noCourses}>No courses</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={styles.mockCount}>
                      {student.mockInterviewsAvailable || 0}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editBtn}
                      onClick={() => startEdit(student)}
                      title="Edit Student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.passwordBtn}
                      onClick={() => openPasswordModal(student._id || student.id)}
                      title="Update Password"
                    >
                      <FaKey />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(student._id || student.id)}
                      title="Delete Student"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.arrowBtn}
            onClick={goPrev}
            disabled={currentPage === 1}
          >
            <FaAngleLeft />
          </button>

          {getPageNumbers().map((num) => (
            <button
              key={num}
              className={currentPage === num ? styles.activePage : ""}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}

          {totalPages > getPageNumbers().slice(-1)[0] && <span>...</span>}

          <button
            className={styles.arrowBtn}
            onClick={goNext}
            disabled={currentPage === totalPages}
          >
            <FaAngleRight />
          </button>
        </div>
      )}

      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={cancelEdit}>
          <div className={styles.sidebarCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarHeader}>
              <h2>Edit Student</h2>
              <button className={styles.closeBtn} onClick={cancelEdit}>×</button>
            </div>
            <div className={styles.sidebarContent}>
              <form onSubmit={saveEdit} className={styles.editForm}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter student name"
                  required
                />
                
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter student email"
                  required
                />
                
                <label className={styles.label}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter student phone"
                  required
                />

                <label className={styles.label}>Mock Interviews Available</label>
                <input
                  type="number"
                  name="mockInterviewsAvailable"
                  value={editData.mockInterviewsAvailable}
                  onChange={(e) => setEditData({ ...editData, mockInterviewsAvailable: parseInt(e.target.value) || 0 })}
                  className={styles.formInput}
                  placeholder="Enter number of mock interviews"
                  min="0"
                  required
                />

                <label className={styles.label}>Purchased Courses</label>
                <div className={styles.coursesSection}>
                  {editData.purchasedCourses && editData.purchasedCourses.length > 0 ? (
                    <div className={styles.coursesListEdit}>
                      {editData.purchasedCourses.map((course, idx) => (
                        <div key={idx} className={styles.courseItemEdit}>
                          <div>
                            <span className={styles.courseTitleEdit}>
                              {course.courseTitle || course.courseId?.title || "Course"}
                            </span>
                            <span className={styles.courseDateEdit}>
                              Purchased: {formatDate(course.purchasedDate)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const courseIdToRemove = course.courseId?._id || course.courseId || (typeof course.courseId === 'string' ? course.courseId : null);
                              if (courseIdToRemove) {
                                handleRemoveCourse(courseIdToRemove);
                              }
                            }}
                            className={styles.removeCourseBtn}
                            title="Remove Course"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noCoursesText}>No courses purchased</p>
                  )}
                  
                  <div className={styles.addCourseSection}>
                    <select
                      value={selectedCourseToAdd}
                      onChange={(e) => setSelectedCourseToAdd(e.target.value)}
                      className={styles.courseSelect}
                    >
                      <option value="">Select a course to add...</option>
                      {allCourses
                        .filter(course => {
                          const courseId = course._id || course.id;
                          return !editData.purchasedCourses.some(pc => {
                            const pcId = pc.courseId?._id || pc.courseId;
                            return String(pcId) === String(courseId);
                          });
                        })
                        .map((course) => (
                          <option key={course._id || course.id} value={course._id || course.id}>
                            {course.title}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      disabled={!selectedCourseToAdd}
                      className={styles.addCourseBtn}
                    >
                      Add Course
                    </button>
                  </div>
                </div>
                
                <div className={styles.formbuttons}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className={styles.sidebarOverlay} onClick={closePasswordModal}>
          <div className={styles.sidebarCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarHeader}>
              <h2>Update Password</h2>
              <button className={styles.closeBtn} onClick={closePasswordModal}>×</button>
            </div>
            <div className={styles.sidebarContent}>
              <form onSubmit={handleUpdatePassword} className={styles.editForm}>
                <label className={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
                
                <div className={styles.formbuttons}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



