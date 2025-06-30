const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Each user can only be associated with one instructor profile
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  coursesTaught: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  // You can add more instructor-specific fields here
});

module.exports = mongoose.model("Instructor", InstructorSchema);
