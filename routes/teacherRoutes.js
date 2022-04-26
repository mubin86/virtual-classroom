const express = require("express");
const teacherController = require("./../controllers/teacherController");
const authController = require('./../controllers/authController');

const router = express.Router();

// ** authController.protect('teacher') means it will query into the User(Teacher) model
// ** authController.protect('student') means it will query into the Student model

router.post('/login', authController.login);

router
  .route("/create-result")
  .post(authController.restrictTo('teacher'), teacherController.createResult);

// Protect all routes after this middleware
router.use(authController.protect('teacher')); //** admin authentication condition also get verified by this condition
router.use(authController.restrictTo('admin'));

router
  .route("/")
  .get(teacherController.getAllTeacaher)
  .post(teacherController.createTeacaher);

router
  .route("/:id")
  .get(teacherController.getSpecificTeacher)
  .patch(teacherController.updateTeacaher)
  .delete(teacherController.deleteTeacaher);


module.exports = router;
