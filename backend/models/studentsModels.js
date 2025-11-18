const mongoose = require("mongoose");

const purchasedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  purchasedDate: {
    type: Date,
    default: Date.now,
  },
});

const studentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required:true,
       trim: true,
    },
    password: {
      type: String,
      default: "",
    },
    purchasedCourses: [purchasedCourseSchema],
    mockInterviewsAvailable: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("students", studentsSchema);