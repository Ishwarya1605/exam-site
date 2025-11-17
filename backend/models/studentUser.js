const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ["student"], default: "student" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("StudentUser", studentSchema);

