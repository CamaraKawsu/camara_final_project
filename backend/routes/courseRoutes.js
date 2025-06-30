const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getCourses) // All authenticated users can view courses
  .post(protect, authorize(["admin", "instructor"]), createCourse);

router
  .route("/:id")
  .get(protect, getCourse)
  .put(protect, authorize(["admin", "instructor"]), updateCourse)
  .delete(protect, authorize(["admin"]), deleteCourse);

module.exports = router;
