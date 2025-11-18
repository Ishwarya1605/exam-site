const mongoose = require ('mongoose');

const courseSchema = new mongoose.Schema (
  {
    title: {type: String, required: true},
    description: {type: String},
    duration: {type: String, required: true},
    price: {type: Number, default: 0},
    compareAt: {type: Number},

    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    image: {type: String},
  },
  {
    timestamps: true,
    strict: true, // Only save fields defined in schema
  }
);
const Course = mongoose.model ('Course', courseSchema);

module.exports = Course;
