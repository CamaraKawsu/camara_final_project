const Course = require("../models/Course");
const Instructor = require("../models/Instructor"); // To assign instructor to a course
const Student = require("../models/Student"); // To remove course from students if deleted

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private (all authenticated users)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .populate("studentsEnrolled", "studentId");
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private (all authenticated users)
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("studentsEnrolled", "studentId");

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin, Instructor
exports.createCourse = async (req, res) => {
  try {
    const { title, courseCode, description, credits, instructorId } = req.body;

    // Optional: Check if instructorId is provided and valid
    if (instructorId) {
      const instructor = await Instructor.findById(instructorId);
      if (!instructor) {
        return res
          .status(404)
          .json({ success: false, msg: "Instructor not found" });
      }
    }

    const course = await Course.create({
      title,
      courseCode,
      description,
      credits,
      instructor: instructorId || null, // Assign instructor if provided
    });

    // If an instructor is assigned, update their coursesTaught
    if (instructorId) {
      await Instructor.findByIdAndUpdate(instructorId, {
        $push: { coursesTaught: course._id },
      });
    }

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin, Instructor (if assigned to course)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    // Check if the user is authorized to update this course
    if (
      req.user.role === "instructor" &&
      course.instructor.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, msg: "Not authorized to update this course" });
    }

    // Handle changing instructor
    const { instructorId } = req.body;
    if (instructorId && instructorId !== course.instructor?.toString()) {
      const newInstructor = await Instructor.findById(instructorId);
      if (!newInstructor) {
        return res
          .status(404)
          .json({ success: false, msg: "New instructor not found" });
      }
      // Remove course from old instructor's coursesTaught
      if (course.instructor) {
        await Instructor.findByIdAndUpdate(course.instructor, {
          $pull: { coursesTaught: course._id },
        });
      }
      // Add course to new instructor's coursesTaught
      await Instructor.findByIdAndUpdate(newInstructor._id, {
        $push: { coursesTaught: course._id },
      });
    } else if (instructorId === null && course.instructor) {
      // If instructor is being unassigned
      await Instructor.findByIdAndUpdate(course.instructor, {
        $pull: { coursesTaught: course._id },
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("instructor", "name email");

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    // Remove course from any enrolled students
    await Student.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    // Remove course from assigned instructor's coursesTaught
    if (course.instructor) {
      await Instructor.findByIdAndUpdate(course.instructor, {
        $pull: { coursesTaught: course._id },
      });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
