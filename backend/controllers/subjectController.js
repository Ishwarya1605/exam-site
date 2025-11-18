const Subject = require("../models/subject.js");
const Topic = require("../models/topic.js");
const Question = require("../models/question.js");
const { convertToBase64 } = require("../middleware/upload.js");

const createSubject = async (req, res) => {
  try {
    const { name, author, students, duration, level, courseId } = req.body;
    const imageBase64 = req.file ? convertToBase64(req.file) : "";

    const newSubject = await Subject.create({
      name,
      author,
      students,
      duration,
      level,
      courseId: courseId || undefined,
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
    
    // Calculate topic and question counts for each subject
    const subjectsWithCounts = await Promise.all(
      subjects.map(async (subject) => {
        const subjectId = subject._id;
        
        try {
          // Count topics for this subject
          const topicCount = await Topic.countDocuments({ 
            subject: subjectId 
          });
          
          let questionCount = 0;
          
          if (topicCount > 0) {
            // Get all topics for this subject
            const topics = await Topic.find({ 
              subject: subjectId 
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
            ...subject.toObject(),
            topicCount: topicCount || 0,
            questionCount: questionCount || 0,
          };
        } catch (err) {
          console.error(`Error calculating counts for subject ${subjectId}:`, err);
          // Return subject with 0 counts if there's an error
          return {
            ...subject.toObject(),
            topicCount: 0,
            questionCount: 0,
          };
        }
      })
    );
    
    res.json(subjectsWithCounts);
  } catch (error) {
    console.error("Error in getSubjects:", error);
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

