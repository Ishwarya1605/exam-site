const express = require("express");
const router = express.Router();

const { 
  createStudents, 
  getStudents, 
  getStudentById,
  updateStudent,
  deleteStudent 
} = require("../controllers/studentsController");

router.post("/student", createStudents);
router.get("/student", getStudents);
router.get("/student/:id", getStudentById);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

module.exports = router;
