"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../../../styles/Topic.module.scss";
import { apiUrl } from "../../../../lib/api";
import TopicsForm from "@/components/TopicsForm";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function TopicsPage({ params }) {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ topic: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(apiUrl(`/api/topics/${subjectId}`));
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) fetchTopics();
  }, [subjectId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.description) return alert("Fill both fields!");

    if (editingId) {
      setTopics(topics.map((t) => (t._id === editingId ? { ...t, ...formData } : t)));
      setEditingId(null);
    } else {
      setTopics([...topics, { ...formData, _id: Date.now() }]);
    }

    setFormData({ topic: "", description: "" });
    setShowModal(false);
  };


  const handleEdit = (topic) => {
    setFormData({ topic: topic.topic, description: topic.description });
    setEditingId(topic._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      setTopics(topics.filter((t) => t._id !== id));
    }
  };


  if (loading) return <p className={styles.loading}>Loading topics...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.topicsContainer}>
      <button
        className={styles.backBtn}
        type="button"
        onClick={handleBackClick}
      >
        <FaArrowLeft />

      </button>
      <div className={styles.topicBtn}>

        <h1 className={styles.topicsTitle}>
          Topics for Subject: {topics[0]?.subject?.title || topics[0]?.subject?.name || subjectId}
        </h1>

        <button
          className={styles.createBtn}
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({ topic: "", description: "" });
          }}
        >
          Create New Topic
        </button>
      </div>
      {showModal && (
        <TopicsForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          editing={!!editingId}
        />
      )}


      {topics.length > 0 ? (
        <ul className={styles.topicsList}>
          {topics.map((t) => (
            <li key={t._id} className={styles.topicItem}>
              <div className={styles.topicHeader}>
                <h3>
                  <Link to={`/admin/topics/${t._id}`} className={styles.topicLink}>
                    {t.topic}
                  </Link>
                </h3>
                <p className={styles.topicDescription}>{t.description}</p>
              </div>

              <div className={styles.topicActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(t)}>
                  <FaEdit />
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(t._id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noTopics}>No topics found for this subject.</p>
      )}

    </div>

  );
}

