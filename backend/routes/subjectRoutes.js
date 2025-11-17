const express = require("express");
const { upload } = require("../middleware/upload.js");
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController.js");

const router = express.Router();


router.post("/", upload.single("image"), createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", upload.single("image"), updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
