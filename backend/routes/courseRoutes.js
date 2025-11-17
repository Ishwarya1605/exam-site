const express = require("express");
const { upload } = require('../middleware/upload.js');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController.js");

const router = express.Router();

router.post("/", upload.single("image"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", upload.single("image"), updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;

