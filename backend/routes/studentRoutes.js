const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollInCourse,
  dropCourse,
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(["admin", "instructor"]), getStudents)
  .post(protect, authorize(["admin"]), createStudent);

router
  .route("/:id")
  .get(protect, authorize(["admin", "instructor", "student"]), getStudent) // Student can view their own profile
  .put(protect, authorize(["admin", "student"]), updateStudent) // Student can update their own profile
  .delete(protect, authorize(["admin"]), deleteStudent);

router.post(
  "/:id/enroll",
  protect,
  authorize(["admin", "student"]),
  enrollInCourse
);
router.post("/:id/drop", protect, authorize(["admin", "student"]), dropCourse);

module.exports = router;
