"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { CheckCircle, ArrowRight } from "lucide-react";
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const rightPanelRef = useRef(null);

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
        // Ensure topicId is a string and properly encoded
        const topicIdStr = String(selectedTopicId).trim();
        const res = await fetch(apiUrl(`/api/questions/topic/${topicIdStr}`));
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `Failed to fetch questions: ${res.status}`);
        }
        
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Failed to load questions");
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    
    fetchQuestions();
  }, [selectedTopicId]);

  // Check completion status for all topics when topics are loaded
  useEffect(() => {
    if (topics.length === 0) return;

    const checkAllCompletions = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);
        if (!user.id) return;

        const completionChecks = await Promise.all(
          topics.map(async (topic) => {
            const topicIdStr = String(topic._id || topic.id);
            try {
              const res = await fetch(
                `${apiUrl("/api/topic-completions/check")}?studentId=${user.id}&topicId=${topicIdStr}`
              );
              if (res.ok) {
                const data = await res.json();
                return { topicId: topicIdStr, isCompleted: data.isCompleted || false };
              }
              return { topicId: topicIdStr, isCompleted: false };
            } catch (err) {
              return { topicId: topicIdStr, isCompleted: false };
            }
          })
        );

        const completedSet = new Set();
        completionChecks.forEach((check) => {
          if (check.isCompleted) {
            completedSet.add(check.topicId);
          }
        });
        setCompletedTopics(completedSet);

        // Check current topic completion
        if (selectedTopicId) {
          const selectedTopicIdStr = String(selectedTopicId);
          const currentCheck = completionChecks.find(
            (c) => String(c.topicId) === selectedTopicIdStr
          );
          setIsCompleted(currentCheck?.isCompleted || false);
        }
      } catch (err) {
        console.error("Error checking completions:", err);
      }
    };

    checkAllCompletions();
  }, [topics, selectedTopicId]);

  const handleTopicClick = (topicId) => {
    // Ensure topicId is properly set
    const topicIdStr = String(topicId);
    setSelectedTopicId(topicIdStr);
  };

  const handleMarkCompleteAndNext = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to mark topics as complete");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.id) {
        alert("User ID not found");
        return;
      }

      setMarkingComplete(true);

      // Mark current topic as complete
      const res = await fetch(apiUrl("/api/topic-completions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentId: user.id, 
          topicId: selectedTopicId 
        }),
      });

      if (res.ok) {
        // Mark current topic as completed in state
        const currentTopicIdStr = String(selectedTopicId);
        setCompletedTopics((prev) => new Set([...prev, currentTopicIdStr]));
        
        // Find next topic - ensure proper ID comparison
        const currentIndex = topics.findIndex((t) => {
          const topicIdStr = String(t._id || t.id);
          return topicIdStr === currentTopicIdStr;
        });
        
        if (currentIndex !== -1 && currentIndex < topics.length - 1) {
          // Move to next topic immediately
          const nextTopic = topics[currentIndex + 1];
          if (nextTopic && nextTopic._id) {
            // Reset completion state for the new topic (will be checked by useEffect)
            setIsCompleted(false);
            // Navigate to next topic
            setSelectedTopicId(nextTopic._id);
            
            // Scroll to top of right panel to show new topic
            setTimeout(() => {
              if (rightPanelRef.current) {
                rightPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }, 100);
          } else {
            console.error("Next topic not found or invalid");
            setIsCompleted(true);
          }
        } else if (currentIndex === topics.length - 1) {
          // No more topics, mark as completed and show message
          setIsCompleted(true);
          alert("Congratulations! You've completed all topics in this subject.");
        } else {
          console.error("Current topic index not found");
          setIsCompleted(true);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to mark topic as complete");
      }
    } catch (err) {
      console.error("Error marking topic as complete:", err);
      alert("Failed to mark topic as complete");
    } finally {
      setMarkingComplete(false);
    }
  };

  const selectedTopic = topics.find((t) => {
    const topicIdStr = String(t._id || t.id);
    return topicIdStr === String(selectedTopicId);
  });

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
            {topics.map((topic) => {
              const topicIdStr = String(topic._id || topic.id);
              const isTopicCompleted = completedTopics.has(topicIdStr);
              const isActive = String(selectedTopicId) === topicIdStr;
              return (
                <li
                  key={topicIdStr}
                  className={`${styles.studentTopicListItem} ${
                    isActive ? styles.active : ""
                  } ${isTopicCompleted ? styles.completed : ""}`}
                  onClick={() => handleTopicClick(topicIdStr)}
                >
                  <div className={styles.topicItemContent}>
                    <h3 className={styles.studentTopicItemTitle}>{topic.topic}</h3>
                    {isTopicCompleted && (
                      <CheckCircle size={18} className={styles.completedIcon} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.noTopics}>No topics found for this subject.</p>
        )}
      </div>

      <div className={styles.studentTopicRight} ref={rightPanelRef}>
        {selectedTopic ? (
          <>
            <div className={styles.studentTopicDetailHeader}>
              <div>
                <h2 className={styles.studentTopicDetailTitle}>
                  {selectedTopic.topic}
                </h2>
                {selectedTopic.description && (
                  <p className={styles.studentTopicDetailDesc}>
                    {selectedTopic.description}
                  </p>
                )}
              </div>
              <Button
                variant={isCompleted ? "outlined" : "contained"}
                color={isCompleted ? "success" : "primary"}
                onClick={handleMarkCompleteAndNext}
                disabled={markingComplete || isCompleted}
                startIcon={<CheckCircle size={20} />}
                endIcon={!isCompleted && <ArrowRight size={20} />}
                className={styles.markCompleteButton}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: 600,
                }}
              >
                {isCompleted ? "Completed" : markingComplete ? "Marking..." : "Mark as Complete & Next"}
              </Button>
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

