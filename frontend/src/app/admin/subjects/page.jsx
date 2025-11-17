"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSection from "../../../components/SubjectSection";
import styles from "../../../styles/SubjectSection.module.scss";
import {
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject as deleteSubjectAction,
  setError,
} from "../../../redux/slices/SubjectSlices";
import { apiUrl } from "../../../lib/api";

export default function SubjectsPage() {
  const dispatch = useDispatch();
  const { subjects, error } = useSelector((state) => state.subjects);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(apiUrl("/api/subjects"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch subjects");
        dispatch(setSubjects(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [token, dispatch]);

  const handleSaveSubject = async (subjectData, editingSubject) => {
    try {
      const isEditing = !!editingSubject;
      const endpoint = isEditing
        ? `/api/subjects/${editingSubject._id}`
        : "/api/subjects";
      const method = isEditing ? "PUT" : "POST";

      const formData = new FormData();

      Object.entries(subjectData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await fetch(apiUrl(endpoint), {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save subject");

      if (isEditing) {
        dispatch(updateSubject(data));
      } else {
        dispatch(addSubject(data));
      }

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      return null;
    }
  };



  const handleDeleteSubject = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/subjects/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete subject");

      dispatch(deleteSubjectAction(id));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div className={styles.subjectPage}>
      {loading && <p>Loading subjects...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <SubjectSection
        initialSubjects={subjects}
        onSaveSubject={handleSaveSubject}
        onDeleteSubject={handleDeleteSubject}
      />
    </div>
  );
}

