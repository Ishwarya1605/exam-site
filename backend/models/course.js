const mongoose = require ('mongoose');

const courseSchema = new mongoose.Schema (
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    students: {type: Number,required:true},
    duration: {type: String, required: true},

    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    image: {type: String},
  },
  {timestamps: true}
);
const Course = mongoose.model ('Course', courseSchema);

module.exports = Course;
