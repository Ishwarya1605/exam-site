const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  createMultipleQuestions,
  getQuestionsByTopic,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

router.post("/", createQuestion);
router.post("/bulk", createMultipleQuestions);
router.get("/", getAllQuestions);
router.get("/topic/:topicId", getQuestionsByTopic);
router.get("/:questionId", getQuestionById);
router.put("/:questionId", updateQuestion);
router.delete("/:questionId", deleteQuestion);

module.exports = router;
