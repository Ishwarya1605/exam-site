const mongoose = require("mongoose");

const adminuserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", adminuserSchema);
