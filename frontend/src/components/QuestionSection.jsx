"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "../lib/api"; 
import styles from "../styles/QuestionSection.module.scss"; 

export default function QuestionSection({ initialQuestions = [], topicId }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    setAdding(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/questions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicId, question: newQuestion }),
      });

      if (!res.ok) throw new Error("Failed to add question");

      const createdQuestion = await res.json();
      setQuestions((prev) => [createdQuestion, ...prev]);
      setNewQuestion("");
      setShowForm(false); 
    } catch (err) {
      console.error(err);
      setError("Failed to add question");
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setNewQuestion("");
    setError(null);
    setShowForm(false);
  };

  return (
    <div className={styles.questionSection}>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={styles.addQuestionButton}
        >
          + Add Question
        </button>
      )}

      {showForm && (
        <div className={styles.addQuestionContainer}>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter new question"
            className={styles.addQuestionInput}
          />
          <button
            onClick={handleAddQuestion}
            disabled={adding}
            className={styles.addQuestion}
          >
            {adding ? "Adding..." : "Add"}
          </button>
          <button
            onClick={handleCancel}
            disabled={adding}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {!questions || questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <ul className={styles.questionsList}>
          {questions.map((q, index) => (
            <li key={q._id}>
              {index + 1}. {q.question}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


