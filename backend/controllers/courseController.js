const Course = require("../models/course.js");
const { convertToBase64 } = require("../middleware/upload.js");

const createCourse = async (req, res) => {

  try {

    const { title, author, students, duration, level } = req.body;
    const imageBase64 = req.file ? convertToBase64(req.file) : "";

    const newCourse = await Course.create({
      title,
      author,
      students,
      duration,
      level,
      image: imageBase64,
    });

    res.status(201).json(newCourse);
  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


const getCourses = async (req, res) => {

  try {

    const courses = await Course.find();
    res.json(courses);
  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


const getCourseById = async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



const updateCourse = async (req, res) => {

  try {

    const { title, author, students, duration, level } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.file) course.image = convertToBase64(req.file);
    if (title) course.title = title;
    if (author) course.author = author;
    if (students) course.students = students;
    if (duration) course.duration = duration;
    if (level) course.level = level;

    const updatedCourse = await course.save();
    res.json( updatedCourse );
  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



const deleteCourse = async (req, res) => {

  try {

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  
};


 