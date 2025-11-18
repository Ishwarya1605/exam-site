"use client";

import React from "react";
import styles from "../styles/Topic.module.scss";

export default function TopicForm({ formData, setFormData, onSubmit, onCancel, editing }) {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <div className={styles.sidebarOverlay} onClick={onCancel}>
            <div className={styles.sidebarCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.sidebarHeader}>
                    <h2>{editing ? "Edit Topic" : "Add New Topic"}</h2>
                    <button className={styles.closeBtn} onClick={onCancel}>×</button>
                </div>
                <div className={styles.sidebarContent}>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="topic"
                            placeholder="Title"
                            value={formData.topic}
                            onChange={handleChange}
                            required
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
        </div>
    )
}; 

