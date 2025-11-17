const express = require("express");
const router = express.Router();
const { registerStudent, getStudents } = require("../controllers/userController");

router.post("/register", registerStudent);

router.get("/all", getStudents);

module.exports = router;





