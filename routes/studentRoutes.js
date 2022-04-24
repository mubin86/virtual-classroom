const express = require("express");
const studentClassrooomController = require("../controllers/studentClassroomController");

const router = express.Router();

// Protect all routes after this middleware
//***not clear about this business logic must be implement later:WIP*****/
// router.use(authController.protect);
// router.use(authController.restrictTo('admin', 'student'));


router
  .route("/")
  .get(studentClassrooomController.getAllEnrolledStudents)
  .post(studentClassrooomController.createStudent);

router
  .route("/:id")
  .get(studentClassrooomController.getSpecificStudent)
  .patch(studentClassrooomController.updateStudent)
  .delete(studentClassrooomController.deleteStudent);


module.exports = router;