const express = require("express");
const classRoomController = require("./../controllers/classRoomController");
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('admin', 'teacher'));

router
  .route("/")
  .get(classRoomController.getAllClassRoom)
  .post(classRoomController.createClassRoom);

router
  .route("/:id")
  .get(classRoomController.getSingleClassRoom)
  .delete(classRoomController.deleteClassRoom);


module.exports = router;
