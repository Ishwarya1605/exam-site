"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { apiUrl } from "../lib/api"; 
import styles from "../styles/QuestionSection.module.scss"; 

export default function QuestionSection({ initialQuestions = [], topicId, readOnly = false }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [expanded, setExpanded] = useState({});
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [answerLanguage, setAnswerLanguage] = useState("javascript");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleAccordionChange = (questionId) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [questionId]: isExpanded,
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    questions.forEach((q) => {
      allExpanded[q._id] = true;
    });
    setExpanded(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  const detectLanguage = (answer) => {
    if (!answer) return "text";
    const trimmed = answer.trim();
    if (trimmed.startsWith("function") || trimmed.includes("const ") || trimmed.includes("let ") || trimmed.includes("var ")) {
      return "javascript";
    }
    if (trimmed.startsWith("def ") || trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      return "python";
    }
    if (trimmed.startsWith("public class") || trimmed.startsWith("import java")) {
      return "java";
    }
    if (trimmed.startsWith("#include") || trimmed.includes("std::")) {
      return "cpp";
    }
    return "text";
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/api/questions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topicId,
          question: formData.question,
          answer: formData.answer,
          defaultCode: "", // Empty string as default
        }),
      });

      if (!res.ok) throw new Error("Failed to add question");

      const createdQuestion = await res.json();
      setQuestions((prev) => [createdQuestion, ...prev]);
      setFormData({ question: "", answer: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add question");
    } finally {
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setFormData({ question: "", answer: "" });
    setAnswerLanguage("javascript");
    setError(null);
    setShowForm(false);
  };

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case "javascript":
        return javascript({ jsx: true });
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return javascript();
    }
  };

  return (
    <>
      <div className={styles.questionSection}>
        {!readOnly && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.addQuestionButton}
          >
            + Add Question
          </button>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!questions || questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          <>
            <div className={styles.accordionControls}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleExpandAll}
                className={styles.expandButton}
              >
                Expand All
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCollapseAll}
                className={styles.collapseButton}
              >
                Collapse All
              </Button>
            </div>
            <div className={styles.questionsList}>
              {questions.map((q, index) => {
                const isExpanded = expanded[q._id] || false;
                const answerLanguage = detectLanguage(q.answer);
                const hasAnswer = q.answer && q.answer.trim().length > 0;

                return (
                  <Accordion
                    key={q._id}
                    expanded={isExpanded}
                    onChange={handleAccordionChange(q._id)}
                    className={styles.questionAccordion}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown size={20} />}
                      className={styles.questionSummary}
                    >
                      <div className={styles.questionNumber}>{index + 1}.</div>
                      <div className={styles.questionText}>{q.question}</div>
                    </AccordionSummary>
                    <AccordionDetails className={styles.questionDetails}>
                      {hasAnswer ? (
                        <div className={styles.answerContainer}>
                          {answerLanguage !== "text" ? (
                            <CodeMirror
                              value={q.answer}
                              height="auto"
                              extensions={[getLanguageExtension(answerLanguage)]}
                              editable={false}
                              basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                readOnly: true,
                              }}
                              theme="light"
                            />
                          ) : (
                            <div className={styles.textAnswer}>{q.answer}</div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.noAnswer}>No answer available</div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className={styles.sidebarOverlay} onClick={handleCancel}>
          <div className={styles.sidebarCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarHeader}>
              <h2>Add New Question</h2>
              <button className={styles.closeBtn} onClick={handleCancel}>×</button>
            </div>
            <div className={styles.sidebarContent}>
              <form onSubmit={handleAddQuestion} className={styles.questionForm}>
                <label className={styles.label}>Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question"
                  className={styles.formInput}
                  rows={3}
                  required
                />
                
                <label className={styles.label}>Answer</label>
                <div className={styles.languageSelector}>
                  <label className={styles.languageLabel}>Language:</label>
                  <select
                    value={answerLanguage}
                    onChange={(e) => setAnswerLanguage(e.target.value)}
                    className={styles.languageSelect}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>
                <div className={styles.codeEditorWrapper}>
                  <CodeMirror
                    value={formData.answer}
                    height="200px"
                    extensions={answerLanguage !== "text" ? [getLanguageExtension(answerLanguage)] : []}
                    onChange={(value) => setFormData({ ...formData, answer: value })}
                    placeholder="Enter the answer (supports code with syntax highlighting)"
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      dropCursor: false,
                      allowMultipleSelections: false,
                    }}
                  />
                </div>
                
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.formbuttons}>
                  <button
                    type="submit"
                    disabled={adding}
                    className={styles.submitBtn}
                  >
                    {adding ? "Adding..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={adding}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


