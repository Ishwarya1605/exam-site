"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/SubjectSection.module.scss";

const levels = ["Beginner", "Intermediate", "Advanced"];

const SubjectForm = ({ onSave, editingSubject, onCancel, courseId = null }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: courseId || "",
    level: "Beginner",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editingSubject) {
      setForm({
        title: editingSubject.title || editingSubject.name || "",
        description: editingSubject.description || "",
        courseId: editingSubject.courseId?._id || editingSubject.courseId || courseId || "",
        level: editingSubject.level || "Beginner",
        image: editingSubject.image || "",
      });
      if (editingSubject.image) setPreview(editingSubject.image);
    } else {
      setForm({
        title: "",
        description: "",
        courseId: courseId || "",
        level: "Beginner",
        image: "",
      });
      setPreview(null);
    }
  }, [editingSubject, courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, image: file || form.image });
    onCancel();
    setForm({
      title: "",
      description: "",
      level: "Beginner",
      image: "",
    });
    setFile(null);
    setPreview(null);
  };


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea 
        name="description" 
        placeholder="Description" 
        value={form.description} 
        onChange={handleChange}
        rows={4}
        className={styles.textarea}
      />
      <select name="level" value={form.level} onChange={handleChange}>
        {levels.map((lvl) => (<option key={lvl}>{lvl}</option>))}
      </select>
      <input type="file" accept="image/*" onChange={handleFileChange} className={styles.imageChoose} />
      {preview && (
        <img src={preview} alt="Preview" className={styles.imagePreview} />
      )}
      <div className={styles.formbuttons}>
        <button type="submit" className={styles.submitBtn}>{editingSubject ? "Update" : "Submit"} </button>
        <button type="button" className={styles.cancelBtn} onClick={() => onCancel()}>Cancel</button>
      </div>
    </form>
  );
};

export default SubjectForm;


