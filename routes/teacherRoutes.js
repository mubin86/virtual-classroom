const express = require("express");
const teacherController = require("./../controllers/teacherController");
const authController = require('./../controllers/authController');

const router = express.Router();

router.post("/login", authController.login);

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
