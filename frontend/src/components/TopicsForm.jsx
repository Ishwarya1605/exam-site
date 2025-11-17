"use client";

import React from "react";
import styles from "../styles/Topic.module.scss";

export default function TopicForm({ formData, setFormData, onSubmit, onCancel, editing }) {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="topic"
                        placeholder="Title"
                        value={formData.topic}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.submitBtn}>
                            {editing ? "Update" : "Submit"}
                        </button>
                        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}; 

