const express = require("express");
const {
  markTopicComplete,
  checkTopicCompletion,
  getStudentCompletions,
} = require("../controllers/topicCompletionController.js");

const router = express.Router();

router.post("/", markTopicComplete);
router.get("/check", checkTopicCompletion);
router.get("/student/:studentId", getStudentCompletions);

module.exports = router;

