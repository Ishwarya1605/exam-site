const express = require("express");
const {
  markTopicComplete,
  checkTopicCompletion,
  getStudentCompletions,
  getAllCompletions,
} = require("../controllers/topicCompletionController.js");

const router = express.Router();

router.post("/", markTopicComplete);
router.get("/check", checkTopicCompletion);
router.get("/student/:studentId", getStudentCompletions);
router.get("/all", getAllCompletions);

module.exports = router;

