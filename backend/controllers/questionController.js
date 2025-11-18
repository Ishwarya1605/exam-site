const Question = require("../models/question");
const Topic = require("../models/topic");

const createQuestion = async (req, res) => {
  try {
    const { topicId, question, answer, defaultCode } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const newQuestion = new Question({
      topic: topicId,
      question,
      answer,
      defaultCode,
    });

    await newQuestion.save();

    res.status(201).json({
      _id: newQuestion._id,
      topicName: topic.topic,
      question: newQuestion.question,
      answer: newQuestion.answer,
      defaultCode: newQuestion.defaultCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createMultipleQuestions = async (req, res) => {
  try {
    const { topicId, questions } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const questionDocs = questions.map((q) => ({
      topic: topicId,
      question: q.question,
      answer: q.answer,
      defaultCode: q.defaultCode,
    }));

    const created = await Question.insertMany(questionDocs);

    const response = created.map((q) => ({
      _id: q._id,
      topicName: topic.topic,
      question: q.question,
      answer: q.answer,
      defaultCode: q.defaultCode,
    }));

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questions for a topic (no pagination - returns all questions)
const getQuestionsByTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId.trim();

    // Fetch all questions for this topic without any limit
    const questions = await Question.find({ topic: topicId }).populate("topic", "topic");

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for this topic" });
    }

    const response = questions.map((q) => ({
      _id: q._id,
      topicName: q.topic ? q.topic.topic : "Unknown Topic",
      question: q.question,
      answer: q.answer,
      defaultCode: q.defaultCode,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: error.message });
  }
};


const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId).populate("topic", "topic");

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      _id: question._id,
      topicName: question.topic ? question.topic.topic : "Unknown Topic",
      question: question.question,
      answer: question.answer,
      defaultCode: question.defaultCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { question, answer, defaultCode } = req.body;

    const updated = await Question.findByIdAndUpdate(
      questionId,
      { question, answer, defaultCode },
      { new: true }
    ).populate("topic", "topic");

    if (!updated) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({
      _id: updated._id,
      topicName: updated.topic ? updated.topic.topic : "Unknown Topic",
      question: updated.question,
      answer: updated.answer,
      defaultCode: updated.defaultCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const deleted = await Question.findByIdAndDelete(questionId);

    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("topic");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  createQuestion,
  createMultipleQuestions,
  getQuestionsByTopic,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};



