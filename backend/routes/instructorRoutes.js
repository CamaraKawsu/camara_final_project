const express = require("express");
const {
  getInstructors,
  getInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  assignCourse,
} = require("../controllers/instructorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(["admin"]), getInstructors)
  .post(protect, authorize(["admin"]), createInstructor);

router
  .route("/:id")
  .get(protect, authorize(["admin", "instructor"]), getInstructor) // Instructor can view their own profile
  .put(protect, authorize(["admin", "instructor"]), updateInstructor) // Instructor can update their own profile
  .delete(protect, authorize(["admin"]), deleteInstructor);

router.post("/:id/assignCourse", protect, authorize(["admin"]), assignCourse);

module.exports = router;
