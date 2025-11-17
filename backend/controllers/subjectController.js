const Subject = require("../models/subject.js");
const { convertToBase64 } = require("../middleware/upload.js");

const createSubject = async (req, res) => {
  try {
    const { name, author, students, duration, level } = req.body;
    const imageBase64 = req.file ? convertToBase64(req.file) : "";

    const newSubject = await Subject.create({
      name,
      author,
      students,
      duration,
      level,
      image: imageBase64,
    });

    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name, author, students, duration, level } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (req.file) subject.image = convertToBase64(req.file);
    if (name) subject.name = name;
    if (author) subject.author = author;
    if (students) subject.students = students;
    if (duration) subject.duration = duration;
    if (level) subject.level = level;

    const updatedSubject = await subject.save();
    res.status(201).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};

