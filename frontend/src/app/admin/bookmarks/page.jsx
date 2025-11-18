"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import { ChevronDown, Bookmark } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { apiUrl } from "../../../lib/api";
import styles from "../../../styles/Bookmark.module.scss";

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setError("Please login to view bookmarks");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (!user.id) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        const res = await fetch(apiUrl(`/api/bookmarks/student/${user.id}`));
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleAccordionChange = (key) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: isExpanded,
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    bookmarks.forEach((course, courseIndex) => {
      allExpanded[`course-${courseIndex}`] = true;
      course.subjects.forEach((subject, subjectIndex) => {
        allExpanded[`subject-${courseIndex}-${subjectIndex}`] = true;
      });
    });
    setExpanded(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpanded({});
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

  if (loading) {
    return (
      <div className={styles.bookmarkPage}>
        <p className={styles.loading}>Loading bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.bookmarkPage}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className={styles.bookmarkPage}>
        <div className={styles.header}>
          <h1>My Bookmarks</h1>
          <p>No bookmarked questions yet. Start bookmarking questions to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookmarkPage}>
      <div className={styles.header}>
        <div>
          <h1>My Bookmarks</h1>
          <p>View all your bookmarked questions organized by course and subject.</p>
        </div>
        <div className={styles.controls}>
          <Button variant="outlined" size="small" onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant="outlined" size="small" onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <div className={styles.bookmarksContainer}>
        {bookmarks.map((course, courseIndex) => (
          <Accordion
            key={course.courseId || `course-${courseIndex}`}
            expanded={expanded[`course-${courseIndex}`] || false}
            onChange={handleAccordionChange(`course-${courseIndex}`)}
            className={styles.courseAccordion}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={20} />}
              className={styles.courseSummary}
            >
              <h2 className={styles.courseTitle}>{course.courseTitle || "Uncategorized"}</h2>
              <span className={styles.subjectCount}>
                {course.subjects.length} {course.subjects.length === 1 ? "Subject" : "Subjects"}
              </span>
            </AccordionSummary>
            <AccordionDetails className={styles.courseDetails}>
              {course.subjects.map((subject, subjectIndex) => (
                <Accordion
                  key={subject.subjectId || `subject-${subjectIndex}`}
                  expanded={expanded[`subject-${courseIndex}-${subjectIndex}`] || false}
                  onChange={handleAccordionChange(`subject-${courseIndex}-${subjectIndex}`)}
                  className={styles.subjectAccordion}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={18} />}
                    className={styles.subjectSummary}
                  >
                    <h3 className={styles.subjectTitle}>{subject.subjectTitle}</h3>
                    <span className={styles.questionCount}>
                      {subject.questions.length} {subject.questions.length === 1 ? "Question" : "Questions"}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails className={styles.subjectDetails}>
                    <div className={styles.questionsList}>
                      {subject.questions.map((item, qIndex) => {
                        const answerLanguage = detectLanguage(item.answer);
                        const hasAnswer = item.answer && item.answer.trim().length > 0;

                        return (
                          <div key={item.bookmarkId || item.questionId} className={styles.questionItem}>
                            <div className={styles.questionHeader}>
                              <div className={styles.questionNumber}>{qIndex + 1}.</div>
                              <div className={styles.questionText}>{item.question}</div>
                              <Bookmark size={18} className={styles.bookmarkIcon} />
                            </div>
                            {hasAnswer && (
                              <div className={styles.answerContainer}>
                                {answerLanguage !== "text" ? (
                                  <CodeMirror
                                    value={item.answer}
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
                                  <div className={styles.textAnswer}>{item.answer}</div>
                                )}
                              </div>
                            )}
                            {!hasAnswer && (
                              <div className={styles.noAnswer}>No answer available</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

