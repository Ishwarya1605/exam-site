"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../lib/api";
import QuestionSection from "../../../../components/QuestionSection";
import styles from "../../../../styles/Topic.module.scss"; 

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(apiUrl(`/api/topics`));
        const data = await res.json();
        if (Array.isArray(data)) setTopics(data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };
    fetchTopics();
  }, []);
  

  useEffect(() => {
    if (!topicId) return;
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/questions/topic/${topicId}`));
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topicId])

  useEffect(() => {
    const index = topics.findIndex((t) => t._id === topicId);
    if (index !== -1) setCurrentIndex(index);
  }, [topics, topicId]);

  

  const handleNext = () => {
    if (currentIndex < topics.length - 1) {
      const nextTopic = topics[currentIndex + 1];
      navigate(`/admin/topics/${nextTopic._id}`);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevTopic = topics[currentIndex - 1];
      navigate(`/admin/topics/${prevTopic._id}`);
    }
  };
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        {topics[currentIndex] && (
          <h2 className={styles.topicTitle}>
            {topics[currentIndex].topic}
          </h2>
        )}
      </div>
    
      <QuestionSection initialQuestions={questions} topicId={topicId}  />
      <div className={styles.buttonContainer}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`${styles.navigationButtons} ${styles.backButton} ${currentIndex === 0 ? styles.disabled : ""
            }`}
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === topics.length - 1}
          className={`${styles.navigationButtons} ${styles.nextButton} ${currentIndex === topics.length - 1 ? styles.disabled : ""
            }`}
        >
          Next →
        </button>
      </div>


    </div>

  );

}