const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    students: { type: Number, required: true },
    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    image: { type: String },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;




