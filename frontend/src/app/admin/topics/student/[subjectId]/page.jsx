"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../../lib/api";
import QuestionSection from "../../../../../components/QuestionSection";
import styles from "../../../../../styles/Topic.module.scss";

export default function StudentTopicPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);

  // Fetch topics for the subject
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setSelectedTopicId(null); // Reset selected topic when subject changes
        const res = await fetch(apiUrl(`/api/topics/${subjectId}`));
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        const topicsArray = Array.isArray(data) ? data : [];
        setTopics(topicsArray);
        
        // Auto-select first topic if available
        if (topicsArray.length > 0) {
          setSelectedTopicId(topicsArray[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) fetchTopics();
  }, [subjectId]);

  // Fetch questions when topic is selected
  useEffect(() => {
    if (!selectedTopicId) return;
    
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/questions/topic/${selectedTopicId}`));
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load questions");
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    
    fetchQuestions();
  }, [selectedTopicId]);

  const handleTopicClick = (topicId) => {
    setSelectedTopicId(topicId);
  };

  const selectedTopic = topics.find((t) => t._id === selectedTopicId);

  if (loading) {
    return (
      <div className={styles.studentTopicContainer}>
        <p className={styles.loading}>Loading topics...</p>
      </div>
    );
  }

  if (error && !topics.length) {
    return (
      <div className={styles.studentTopicContainer}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.studentTopicContainer}>
      <div className={styles.studentTopicLeft}>
        <div className={styles.studentTopicListHeader}>
          <h2>Topics</h2>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Back
          </button>
        </div>
        {topics.length > 0 ? (
          <ul className={styles.studentTopicList}>
            {topics.map((topic) => (
              <li
                key={topic._id}
                className={`${styles.studentTopicListItem} ${
                  selectedTopicId === topic._id ? styles.active : ""
                }`}
                onClick={() => handleTopicClick(topic._id)}
              >
                <h3 className={styles.studentTopicItemTitle}>{topic.topic}</h3>
                {topic.description && (
                  <p className={styles.studentTopicItemDesc}>{topic.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noTopics}>No topics found for this subject.</p>
        )}
      </div>

      <div className={styles.studentTopicRight}>
        {selectedTopic ? (
          <>
            <div className={styles.studentTopicDetailHeader}>
              <h2 className={styles.studentTopicDetailTitle}>
                {selectedTopic.topic}
              </h2>
              {selectedTopic.description && (
                <p className={styles.studentTopicDetailDesc}>
                  {selectedTopic.description}
                </p>
              )}
            </div>
            {loadingQuestions ? (
              <p className={styles.loading}>Loading questions...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              <QuestionSection
                initialQuestions={questions}
                topicId={selectedTopicId}
                readOnly={true}
              />
            )}
          </>
        ) : (
          <div className={styles.studentTopicEmpty}>
            <p>Select a topic from the list to view questions</p>
          </div>
        )}
      </div>
    </div>
  );
}

