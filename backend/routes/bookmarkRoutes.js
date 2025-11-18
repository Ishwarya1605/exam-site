const express = require("express");
const {
  addBookmark,
  removeBookmark,
  getStudentBookmarks,
  checkBookmark,
} = require("../controllers/bookmarkController.js");

const router = express.Router();

router.post("/", addBookmark);
router.delete("/", removeBookmark);
router.get("/student/:studentId", getStudentBookmarks);
router.get("/check", checkBookmark);

module.exports = router;

