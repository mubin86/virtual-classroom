const express = require("express");
const classRoomController = require("./../controllers/classRoomController");
const classRoomPostController = require("./../controllers/classRoomPostController");
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect('teacher')); //** admin condition also get verified by this condition
router.use(authController.restrictTo('admin', 'teacher'));

router
  .route("/post")
  .get(classRoomPostController.getAllClassRoomPost)
  .post(classRoomPostController.createClassRoomPost);

router
  .route("/post/:id")
  .get(classRoomPostController.getSingleClassRoomPost)
  .patch(classRoomPostController.updateClassRoomPost)
  .delete(classRoomPostController.deleteClassRoomPost);

router
  .route("/end-class/:id")
  .patch(classRoomController.endClassRoom)

router
  .route("/")
  .get(classRoomController.getAllClassRoom)
  .post(classRoomController.createClassRoom);

router
  .route("/:id")
  .get(classRoomController.getSingleClassRoom)
  .delete(classRoomController.deleteClassRoom);


module.exports = router;
