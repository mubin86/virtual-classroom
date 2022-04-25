const express = require("express");
const studentClassrooomController = require("../controllers/studentClassroomController");
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
//***not clear about this business logic must be implement later:WIP*****/
// router.use(authController.protect);
// router.use(authController.restrictTo('admin', 'student'));

router.post('/login', authController.studentLogin);


router
  .route("/view-all-classromm")
  .get(authController.protect('student'), 
    authController.restrictTo('student'), 
    studentClassrooomController.viewAllClassroomByStudent
 );

router
  .route("/view-classroom-post/:classroomId")
  .get(authController.protect('student'),
    authController.restrictTo('student'), 
    studentClassrooomController.viewClassRoomPost
 );

router
  .route("/")
  .get(authController.protect('teacher'),
    authController.restrictTo('admin', 'teacher'), 
    studentClassrooomController.getAllEnrolledStudents
  )
  .post(studentClassrooomController.createStudent);

router
  .route("/:id")
  .get(studentClassrooomController.getSpecificStudent)
  .patch(authController.protect('student'),
    authController.restrictTo('student'),
    studentClassrooomController.updateStudent
  )
  .delete(authController.protect('teacher'),
    authController.restrictTo('admin', 'teacher'),
    studentClassrooomController.deleteStudent
  );


module.exports = router;