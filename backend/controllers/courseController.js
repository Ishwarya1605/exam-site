const Course = require("../models/course.js");
const Subject = require("../models/subject.js");
const Topic = require("../models/topic.js");
const Question = require("../models/question.js");
const { convertToBase64 } = require("../middleware/upload.js");

const createCourse = async (req, res) => {
  try {
    const { title, author, students, duration, level, price, compareAt } = req.body;
    const imageBase64 = req.file ? convertToBase64(req.file) : "";

    const newCourse = await Course.create({
      title,
      author,
      students,
      duration,
      level,
      price: price || 0,
      compareAt: compareAt || undefined,
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
    
    // Calculate subject and question counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const courseId = course._id;
        
        // Count subjects for this course
        const subjectCount = await Subject.countDocuments({ courseId });
        
        // Get all subjects for this course to find topics
        const subjects = await Subject.find({ courseId }).select("_id");
        const subjectIds = subjects.map(s => s._id);
        
        // Count topics for these subjects
        const topics = await Topic.find({ subject: { $in: subjectIds } }).select("_id");
        const topicIds = topics.map(t => t._id);
        
        // Count questions for these topics
        const questionCount = await Question.countDocuments({ topic: { $in: topicIds } });
        
        return {
          ...course.toObject(),
          subjectCount,
          questionCount,
        };
      })
    );
    
    res.json(coursesWithCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const courseId = course._id;
    
    // Count subjects for this course
    const subjectCount = await Subject.countDocuments({ courseId });
    
    // Get all subjects for this course to find topics
    const subjects = await Subject.find({ courseId }).select("_id");
    const subjectIds = subjects.map(s => s._id);
    
    // Count topics for these subjects
    const topics = await Topic.find({ subject: { $in: subjectIds } }).select("_id");
    const topicIds = topics.map(t => t._id);
    
    // Count questions for these topics
    const questionCount = await Question.countDocuments({ topic: { $in: topicIds } });
    
    const courseWithCounts = {
      ...course.toObject(),
      subjectCount,
      questionCount,
    };

    res.json(courseWithCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateCourse = async (req, res) => {
  try {
    const { title, author, students, duration, level, price, compareAt } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.file) course.image = convertToBase64(req.file);
    if (title) course.title = title;
    if (author) course.author = author;
    if (students) course.students = students;
    if (duration) course.duration = duration;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (compareAt !== undefined) course.compareAt = compareAt;

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


 