const Student = require("../models/studentsModels");
const Course = require("../models/course");
const bcrypt = require("bcryptjs");

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
      ? await Student.find().populate("purchasedCourses.courseId", "title")
      : await Student.find({ isDeleted: false }).populate("purchasedCourses.courseId", "title");
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
    const { name, email, phone, purchasedCourses, mockInterviewsAvailable } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (purchasedCourses !== undefined) updateData.purchasedCourses = purchasedCourses;
    if (mockInterviewsAvailable !== undefined) updateData.mockInterviewsAvailable = mockInterviewsAvailable;

    const updated = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } 
    ).populate("purchasedCourses.courseId", "title");

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const updated = await Student.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCourseToStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if course already exists
    const existingCourse = student.purchasedCourses.find(
      (pc) => pc.courseId.toString() === courseId
    );

    if (existingCourse) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    student.purchasedCourses.push({
      courseId: courseId,
      courseTitle: course.title,
      purchasedDate: new Date(),
    });

    await student.save();
    const updated = await Student.findById(id).populate("purchasedCourses.courseId", "title");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCourseFromStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.purchasedCourses = student.purchasedCourses.filter(
      (pc) => {
        const pcId = pc.courseId?._id ? pc.courseId._id.toString() : pc.courseId?.toString() || pc.courseId;
        return pcId !== courseId.toString();
      }
    );

    await student.save();
    const updated = await Student.findById(id).populate("purchasedCourses.courseId", "title");
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




