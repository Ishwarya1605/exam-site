const Bookmark = require("../models/bookmark.js");
const Question = require("../models/question.js");
const Topic = require("../models/topic.js");
const Subject = require("../models/subject.js");
const Course = require("../models/course.js");

// Add bookmark
const addBookmark = async (req, res) => {
  try {
    const { studentId, questionId } = req.body;

    if (!studentId || !questionId) {
      return res.status(400).json({ error: "Student ID and Question ID are required" });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ studentId, questionId });
    if (existingBookmark) {
      return res.status(200).json({ message: "Question already bookmarked", bookmark: existingBookmark });
    }

    const bookmark = await Bookmark.create({ studentId, questionId });
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Question already bookmarked" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Remove bookmark
const removeBookmark = async (req, res) => {
  try {
    const { studentId, questionId } = req.body;

    if (!studentId || !questionId) {
      return res.status(400).json({ error: "Student ID and Question ID are required" });
    }

    const bookmark = await Bookmark.findOneAndDelete({ studentId, questionId });
    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookmarks for a student with full question details
const getStudentBookmarks = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    // Get all bookmarks for the student with populated question data
    const bookmarks = await Bookmark.find({ studentId })
      .populate({
        path: "questionId",
        populate: {
          path: "topic",
          populate: {
            path: "subject",
            populate: {
              path: "courseId",
            },
          },
        },
      })
      .sort({ createdAt: -1 });

    // Group by course -> subject -> questions
    const groupedBookmarks = {};
    
    bookmarks.forEach((bookmark) => {
      const question = bookmark.questionId;
      if (!question || !question.topic || !question.topic.subject) return;

      const subject = question.topic.subject;
      const course = subject.courseId || { _id: null, title: "Uncategorized" };

      const courseId = course._id?.toString() || "uncategorized";
      const courseTitle = course.title || "Uncategorized";

      const subjectId = subject._id?.toString() || "unknown";
      const subjectTitle = subject.title || subject.name || "Unknown Subject";

      if (!groupedBookmarks[courseId]) {
        groupedBookmarks[courseId] = {
          courseId: course._id,
          courseTitle,
          subjects: {},
        };
      }

      if (!groupedBookmarks[courseId].subjects[subjectId]) {
        groupedBookmarks[courseId].subjects[subjectId] = {
          subjectId: subject._id,
          subjectTitle,
          questions: [],
        };
      }

      groupedBookmarks[courseId].subjects[subjectId].questions.push({
        bookmarkId: bookmark._id,
        question: question.question,
        answer: question.answer,
        questionId: question._id,
        createdAt: bookmark.createdAt,
      });
    });

    // Convert to array format
    const result = Object.values(groupedBookmarks).map((course) => ({
      courseId: course.courseId,
      courseTitle: course.courseTitle,
      subjects: Object.values(course.subjects),
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: error.message });
  }
};

// Check if a question is bookmarked by a student
const checkBookmark = async (req, res) => {
  try {
    const { studentId, questionId } = req.query;

    if (!studentId || !questionId) {
      return res.status(400).json({ error: "Student ID and Question ID are required" });
    }

    const bookmark = await Bookmark.findOne({ studentId, questionId });
    res.json({ isBookmarked: !!bookmark, bookmarkId: bookmark?._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getStudentBookmarks,
  checkBookmark,
};

