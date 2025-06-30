const Instructor = require("../models/Instructor");
const User = require("../models/User");
const Course = require("../models/Course");

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Private/Admin
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .populate("user", "name email")
      .populate("coursesTaught", "title courseCode");
    res
      .status(200)
      .json({ success: true, count: instructors.length, data: instructors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Private/Admin, Instructor (self)
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .populate("user", "name email")
      .populate("coursesTaught", "title courseCode");

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, msg: "Instructor not found" });
    }

    // Allow instructor to view their own profile, or admin to view any
    if (
      req.user.role === "instructor" &&
      instructor.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Not authorized to view this instructor profile",
        });
    }

    res.status(200).json({ success: true, data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new instructor
// @route   POST /api/instructors
// @access  Private/Admin
exports.createInstructor = async (req, res) => {
  try {
    const { userId, employeeId, department } = req.body;

    // Check if the user exists and is not already an instructor or student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    const existingInstructor = await Instructor.findOne({ user: userId });
    if (existingInstructor) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "User is already associated with an instructor profile",
        });
    }
    // You might also want to check if the user is a student

    const instructor = await Instructor.create({
      user: userId,
      employeeId,
      department,
    });

    res.status(201).json({ success: true, data: instructor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private/Admin, Instructor (self)
exports.updateInstructor = async (req, res) => {
  try {
    let instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, msg: "Instructor not found" });
    }

    // Allow instructor to update their own profile, or admin to update any
    if (
      req.user.role === "instructor" &&
      instructor.user.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          msg: "Not authorized to update this instructor profile",
        });
    }

    instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    res.status(200).json({ success: true, data: instructor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private/Admin
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, msg: "Instructor not found" });
    }

    // Disassociate instructor from any courses they teach
    await Course.updateMany(
      { instructor: instructor._id },
      { $set: { instructor: null } } // Set instructor field to null
    );

    await instructor.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Assign a course to an instructor
// @route   POST /api/instructors/:id/assignCourse
// @access  Private/Admin
exports.assignCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const instructor = await Instructor.findById(req.params.id);
    const course = await Course.findById(courseId);

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, msg: "Instructor not found" });
    }
    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    // If course is already assigned to a different instructor, unassign it first
    if (
      course.instructor &&
      course.instructor.toString() !== instructor._id.toString()
    ) {
      await Instructor.findByIdAndUpdate(course.instructor, {
        $pull: { coursesTaught: course._id },
      });
    }

    // Assign the course to the new instructor
    course.instructor = instructor._id;
    await course.save();

    // Add the course to the instructor's coursesTaught if not already there
    if (!instructor.coursesTaught.includes(courseId)) {
      instructor.coursesTaught.push(courseId);
      await instructor.save();
    }

    res.status(200).json({ success: true, data: instructor.coursesTaught });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
