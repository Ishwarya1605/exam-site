const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
        defaultCode: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);