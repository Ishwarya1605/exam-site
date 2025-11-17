const Student = require("../models/studentsModels");

exports.createStudents = async (req, res) => {
  try {
    const students = req.body; 
    if (!Array.isArray(students) || students.length === 0)
      return res.status(400).json({ message: "Students array required" });

    const newStudents = await Student.insertMany(students);
    res.status(201).json(newStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const students = showAll
      ? await Student.find()
      : await Student.find({ isDeleted: false });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await Student.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true } 
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student marked as deleted", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




