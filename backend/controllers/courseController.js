const Course = require("../models/course.js");
const Subject = require("../models/subject.js");
const Topic = require("../models/topic.js");
const Question = require("../models/question.js");
const { convertToBase64 } = require("../middleware/upload.js");

const createCourse = async (req, res) => {
  try {
    const { title, description, duration, level, price, compareAt, subjects } = req.body;
    const imageBase64 = req.file ? convertToBase64(req.file) : "";

    // Parse subjects if it's a JSON string (from FormData)
    let subjectsArray = [];
    if (subjects) {
      try {
        subjectsArray = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
      } catch (e) {
        subjectsArray = Array.isArray(subjects) ? subjects : [];
      }
    }

    // Explicitly create course with only valid fields (exclude author/students if they exist in req.body)
    const courseData = {
      title,
      description,
      duration,
      level,
      price: price || 0,
      compareAt: compareAt || undefined,
      image: imageBase64,
    };

    // Remove any author/students fields if they somehow got in
    delete courseData.author;
    delete courseData.students;

    const newCourse = await Course.create(courseData);

    // Link selected subjects to this course (don't fail course creation if this fails)
    if (subjectsArray.length > 0) {
      try {
        // First verify subjects exist
        const validSubjects = await Subject.find({
          _id: { $in: subjectsArray }
        }).select('_id');
        
        const validSubjectIds = validSubjects.map(s => s._id);
        
        if (validSubjectIds.length > 0) {
          await Subject.updateMany(
            { _id: { $in: validSubjectIds } },
            { $set: { courseId: newCourse._id } },
            { runValidators: false, strict: false }
          );
        }
      } catch (subjectError) {
        // Log error but don't fail course creation
        console.error('Error linking subjects to course:', subjectError.message);
      }
    }

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
        
        try {
          // Count subjects for this course - ensure courseId matches exactly
          const subjectCount = await Subject.countDocuments({ 
            courseId: courseId 
          });
          
          // Get all subjects for this course to find topics
          const subjects = await Subject.find({ 
            courseId: courseId 
          }).select("_id");
          
          let questionCount = 0;
          
          if (subjects && subjects.length > 0) {
            const subjectIds = subjects.map(s => s._id);
            
            // Count topics for these subjects
            const topics = await Topic.find({ 
              subject: { $in: subjectIds } 
            }).select("_id");
            
            if (topics && topics.length > 0) {
              const topicIds = topics.map(t => t._id);
              
              // Count questions for these topics
              questionCount = await Question.countDocuments({ 
                topic: { $in: topicIds } 
              });
            }
          }
          
          return {
            ...course.toObject(),
            subjectCount: subjectCount || 0,
            questionCount: questionCount || 0,
          };
        } catch (err) {
          console.error(`Error calculating counts for course ${courseId}:`, err);
          // Return course with 0 counts if there's an error
          return {
            ...course.toObject(),
            subjectCount: 0,
            questionCount: 0,
          };
        }
      })
    );
    
    res.json(coursesWithCounts);
  } catch (error) {
    console.error("Error in getCourses:", error);
    res.status(500).json({ error: error.message });
  }
};


const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const courseId = course._id;
    
    // Get subjects linked to this course
    const subjects = await Subject.find({ courseId }).select("_id name");
    
    // Count subjects for this course
    const subjectCount = await Subject.countDocuments({ courseId });
    
    // Get all subjects for this course to find topics
    const subjectIds = subjects.map(s => s._id);
    
    // Count topics for these subjects
    const topics = await Topic.find({ subject: { $in: subjectIds } }).select("_id");
    const topicIds = topics.map(t => t._id);
    
    // Count questions for these topics
    const questionCount = await Question.countDocuments({ topic: { $in: topicIds } });
    
    const courseWithCounts = {
      ...course.toObject(),
      subjects: subjects.map(s => s._id.toString()),
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
    const { title, description, duration, level, price, compareAt, subjects } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Explicitly update only valid fields and remove author/students if they exist
    if (req.file) course.image = convertToBase64(req.file);
    if (title) course.title = title;
    if (description !== undefined) course.description = description;
    if (duration) course.duration = duration;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (compareAt !== undefined) course.compareAt = compareAt;
    
    // Explicitly remove author/students if they somehow got set
    if (course.author !== undefined) delete course.author;
    if (course.students !== undefined) delete course.students;

    const updatedCourse = await course.save();

    // Handle subject linking
    if (subjects !== undefined) {
      // Parse subjects if it's a JSON string (from FormData)
      let subjectsArray = [];
      try {
        subjectsArray = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
      } catch (e) {
        subjectsArray = Array.isArray(subjects) ? subjects : [];
      }

      // Handle subject linking (don't fail course update if this fails)
      try {
        // Remove courseId from subjects that are no longer selected
        await Subject.updateMany(
          { courseId: course._id },
          { $unset: { courseId: "" } },
          { runValidators: false, strict: false }
        );
        
        // Link new selected subjects to this course
        if (subjectsArray.length > 0) {
            // First verify subjects exist
            const validSubjects = await Subject.find({
              _id: { $in: subjectsArray }
            }).select('_id');
          
          const validSubjectIds = validSubjects.map(s => s._id);
          
          if (validSubjectIds.length > 0) {
            await Subject.updateMany(
              { _id: { $in: validSubjectIds } },
              { $set: { courseId: course._id } },
              { runValidators: false, strict: false }
            );
          }
        }
      } catch (subjectError) {
        // Log error but don't fail course update
        console.error('Error updating subject links:', subjectError.message);
      }
    }

    res.json(updatedCourse);
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


 