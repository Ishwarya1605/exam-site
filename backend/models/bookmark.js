const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure one bookmark per student-question combination
bookmarkSchema.index({ studentId: 1, questionId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;

