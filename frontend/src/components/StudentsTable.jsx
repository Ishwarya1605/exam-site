"use client";

import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaFilter,
  FaSearch,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
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
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditData({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const saveEdit = (id) => {
    onUpdate(id, editData);
    setEditingId(null);
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    {editingId === student.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td>
                    {editingId === student.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td>
                    {editingId === student.id ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      student.phone
                    )}
                  </td>
                  <td className={styles.actionCell}>
                    {editingId === student.id ? (
                      <>
                        <button
                          className={styles.editBtn}
                          onClick={() => saveEdit(student.id)}
                        >
                          <FaSave />
                        </button>
                        <button className={styles.deleteBtn} onClick={cancelEdit}>
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editBtn}
                          onClick={() => startEdit(student)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => onDelete(student.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
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
    </div>
  );
}



