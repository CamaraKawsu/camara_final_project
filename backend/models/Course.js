const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to the User model, assuming instructors are users
    required: false, // A course might not have an instructor assigned initially
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
