const express = require("express");
const router = express.Router();

const { 
  createStudents, 
  getStudents, 
  getStudentById,
  updateStudent,
  deleteStudent,
  updatePassword,
  addCourseToStudent,
  removeCourseFromStudent
} = require("../controllers/studentsController");

router.post("/student", createStudents);
router.get("/student", getStudents);
router.get("/student/:id", getStudentById);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);
router.put("/student/:id/password", updatePassword);
router.post("/student/:id/courses", addCourseToStudent);
router.delete("/student/:id/courses", removeCourseFromStudent);

module.exports = router;
