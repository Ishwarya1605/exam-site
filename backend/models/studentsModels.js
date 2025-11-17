const mongoose = require("mongoose");

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("students", studentsSchema);