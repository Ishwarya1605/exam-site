"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/Course.module.scss";
import { apiUrl } from "@/lib/api";
import Select from "react-select";

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const CourseForm = ({ onSave, editingCourse, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    price: "",
    subjects: [],
  });

  const [allSubjects, setAllSubjects] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(apiUrl("/api/subjects"));
        const data = await res.json();
        if (Array.isArray(data)) setAllSubjects(data);
      } catch {}
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        duration: editingCourse.duration || "",
        difficulty: editingCourse.difficulty || editingCourse.level || "Beginner",
        price: editingCourse.price || "",
        subjects: editingCourse.subjects || [],
      });
      if (editingCourse.image) setImagePreview(editingCourse.image);
    } else {
      setForm({
        title: "",
        description: "",
        duration: "",
        difficulty: "Beginner",
        price: "",
        subjects: [],
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [editingCourse]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subjectOptions = allSubjects.map((s) => ({
    value: s._id || s.id,
    label: s.name,
  }));

  const handleSubjectsChange = (values) => {
    setForm({ ...form, subjects: (values || []).map((v) => v.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map difficulty to level for backend
    const { difficulty, ...rest } = form;
    const result = await onSave({ ...rest, level: difficulty, image: imageFile });
    
    // Only close and reset if save was successful
    if (result) {
      onCancel();
      setForm({
        title: "",
        description: "",
        duration: "",
        difficulty: "Beginner",
        price: "",
        subjects: [],
      });
      setImageFile(null);
      setImagePreview(null);
    }
    // If result is null/undefined, there was an error - form stays open
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="title"
        placeholder="Course title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        rows={4}
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="duration"
        placeholder="Duration (weeks)"
        type="number"
        value={form.duration}
        onChange={handleChange}
      />
      <select name="difficulty" value={form.difficulty} onChange={handleChange}>
        {difficulties.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl}
          </option>
        ))}
      </select>
      <input
        name="price"
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={handleChange}
      />

      <label style={{ fontSize: 12, color: "#555" }}>Course Image</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
        />
      )}

      <label style={{ fontSize: 12, color: "#555" }}>Subjects</label>
      <Select
        isMulti
        options={subjectOptions}
        value={subjectOptions.filter((o) => 
          form.subjects.some(subId => 
            String(subId) === String(o.value)
          )
        )}
        onChange={handleSubjectsChange}
        classNamePrefix="react-select"
        placeholder="Select subjects..."
      />

      <div className={styles.formbuttons}>
        <button type="submit" className={styles.submitBtn}>
          {editingCourse ? "Update" : "Submit"}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={() => onCancel()}>
          Cancel
        </button>
      </div>
    </form>
  );
};
export default CourseForm;

