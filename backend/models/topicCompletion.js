const mongoose = require("mongoose");

const topicCompletionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure one completion record per student-topic combination
topicCompletionSchema.index({ studentId: 1, topicId: 1 }, { unique: true });

const TopicCompletion = mongoose.model("TopicCompletion", topicCompletionSchema);
module.exports = TopicCompletion;

