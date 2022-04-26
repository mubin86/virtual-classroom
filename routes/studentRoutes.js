const express = require("express");
const studentClassrooomController = require("../controllers/studentClassroomController");
const authController = require('./../controllers/authController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/login', authController.studentLogin);

router
  .route("/view-result")
  .get(authController.protect('student'),  
    authController.restrictTo('student'), 
    studentClassrooomController.viewResult
);

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
  .route("/upload/submissions")
  .post(authController.protect('student'), 
    authController.restrictTo('student'), 
    upload.single('file'),
    studentClassrooomController.createSubmission
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