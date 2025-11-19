const TopicCompletion = require("../models/topicCompletion.js");

// Mark topic as complete
const markTopicComplete = async (req, res) => {
  try {
    const { studentId, topicId } = req.body;

    if (!studentId || !topicId) {
      return res.status(400).json({ error: "Student ID and Topic ID are required" });
    }

    // Check if already completed
    const existing = await TopicCompletion.findOne({ studentId, topicId });
    if (existing) {
      return res.status(200).json({ 
        message: "Topic already marked as complete", 
        completion: existing 
      });
    }

    const completion = await TopicCompletion.create({ 
      studentId, 
      topicId,
      completedAt: new Date()
    });
    res.status(201).json(completion);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Topic already marked as complete" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Check if topic is completed
const checkTopicCompletion = async (req, res) => {
  try {
    const { studentId, topicId } = req.query;

    if (!studentId || !topicId) {
      return res.status(400).json({ error: "Student ID and Topic ID are required" });
    }

    const completion = await TopicCompletion.findOne({ studentId, topicId });
    res.json({ isCompleted: !!completion, completion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all completed topics for a student
const getStudentCompletions = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const completions = await TopicCompletion.find({ studentId })
      .populate("topicId", "topic description")
      .populate("studentId", "name username email")
      .sort({ completedAt: -1 });

    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all completions (for admin view)
const getAllCompletions = async (req, res) => {
  try {
    const { startDate, endDate, studentId } = req.query;
    
    let query = {};
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) {
        query.completedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.completedAt.$lte = new Date(endDate);
      }
    }
    
    // Filter by student if provided
    if (studentId) {
      query.studentId = studentId;
    }

    const completions = await TopicCompletion.find(query)
      .populate("topicId", "topic description")
      .populate("studentId", "name username email")
      .sort({ completedAt: -1 });

    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markTopicComplete,
  checkTopicCompletion,
  getStudentCompletions,
  getAllCompletions,
};

