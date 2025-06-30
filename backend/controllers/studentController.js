const Student = require("../models/Student");
const User = require("../models/User");
const Course = require("../models/Course");

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin, Instructor
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email")
      .populate("courses", "title courseCode");
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin, Instructor, Student (self)
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("user", "name email")
      .populate("courses", "title courseCode");

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Allow student to view their own profile, or admin/instructor to view any
    if (
      req.user.role === "student" &&
      student.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Not authorized to view this student profile",
        });
    }

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    const { userId, studentId, major } = req.body;

    // Check if the user exists and is not already a student or instructor
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    const existingStudent = await Student.findOne({ user: userId });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "User is already associated with a student profile",
        });
    }
    // You might also want to check if the user is an instructor

    const student = await Student.create({
      user: userId,
      studentId,
      major,
    });

    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin, Student (self)
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Allow student to update their own profile, or admin to update any
    if (
      req.user.role === "student" &&
      student.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Not authorized to update this student profile",
        });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    await student.deleteOne(); // Use deleteOne() for Mongoose 6+

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Enroll student in a course
// @route   POST /api/students/:id/enroll
// @access  Private/Admin, Student (self)
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    // Allow student to enroll themselves, or admin to enroll anyone
    if (
      req.user.role === "student" &&
      student.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, msg: "Not authorized to enroll this student" });
    }

    if (student.courses.includes(courseId)) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Student already enrolled in this course",
        });
    }

    student.courses.push(courseId);
    await student.save();

    // Also update the course's studentsEnrolled array
    if (!course.studentsEnrolled.includes(student._id)) {
      course.studentsEnrolled.push(student._id);
      await course.save();
    }

    res.status(200).json({ success: true, data: student.courses });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Drop student from a course
// @route   POST /api/students/:id/drop
// @access  Private/Admin, Student (self)
exports.dropCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    // Allow student to drop themselves, or admin to drop anyone
    if (
      req.user.role === "student" &&
      student.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Not authorized to drop this student from a course",
        });
    }

    student.courses = student.courses.filter((c) => c.toString() !== courseId);
    await student.save();

    // Also update the course's studentsEnrolled array
    course.studentsEnrolled = course.studentsEnrolled.filter(
      (s) => s.toString() !== student._id.toString()
    );
    await course.save();

    res.status(200).json({ success: true, data: student.courses });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
