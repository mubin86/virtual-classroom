
const Student = require("../models/studentModel");
const Classroom = require("../models/classroomModel");
const Result = require("../models/resultModel");
const ClassroomPost = require("../models/classroomPostModel");
const StudentClassroom = require("../models/studentClassroomModel");
const StudentSubmission = require("../models/studentSubmissionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.getAllEnrolledStudents = catchAsync(async (req, res, next) => {
    let enrolledStudents;
    
    if(req.query.classroomId){
      enrolledStudents = await StudentClassroom.find({classroom: req.query.classroomId});
    }else if(req.query.schoolId){
      enrolledStudents = await Student.find({schoolId: req.query.schoolId});
    }else{
      enrolledStudents = await StudentClassroom.find();
    }

    res.status(200).json({
      status: "success",
      results: enrolledStudents.length,
      data: {
        enrolledStudents,
      },
    });
});

exports.getSpecificStudent = catchAsync(async (req, res, next) => {
    const student = await StudentClassroom.findOne({student: req.params.id});
    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
});

exports.createStudent = catchAsync(async (req, res, next) => {
  /**fisrtly check if the Classroom exists or not with the given code*/
  console.log("create student controller is called");
    let classroom = await Classroom.findOne({code: req.body.code});
    if(!classroom){
        return next(new AppError("No Classroom found with the requested code", 400));
    }

    //**find all the enrolled students in that class */
    let allEnrolledStudents = await StudentClassroom.find({ classroom });
    console.log("allEnrolledStudents is ", allEnrolledStudents);
    
    let filteredStudent = allEnrolledStudents.filter(e => e.student.email == req.body.email);

    //**checking the requested email already present in any other classroom*/
    if(filteredStudent.length > 0){
      return next(new AppError("This email already exits in this classroom", 400));
    }

    let newStudentFlag = false;
    let savedStudent;
    //**check if that requested email already enrolled in any other class or not*/
    //**if yes we actually omit the current info bcz if we register the same email again then that will be not a good choice*/
    //**suppose one student registered into two separate classroom with the same email but with two different password */
    //**In this case one student with one email containing two different password so when he try to login into the Main website portal
    //**then there actually the architecture lacks*/
    const student = await Student.findOne({email: req.body.email});
    if(!student){
        const newStudent = new Student({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          schoolId: req.body.schoolId
      })
      savedStudent = await newStudent.save();
      newStudentFlag = true;
    }
  
    const newStudentEnrolledClass =  new StudentClassroom({
       student: newStudentFlag ? savedStudent : student,
       classroom: classroom
    })
    let enrolledStudentInClass =  await newStudentEnrolledClass.save();

    enrolledStudentInClass.student.password = undefined;
    res.status(201).json({
        status: "success",
        data: {
            enrolledStudentClassInfo: enrolledStudentInClass,
        },
    });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!student) {
        return next(new AppError("No student found with that ID", 404));
      }
    
      res.status(200).json({
        status: "success",
        data: {
            student,
        },
      });
});

exports.deleteStudent = catchAsync(async (req, res, next) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
});


exports.viewAllClassroomByStudent = catchAsync(async (req, res, next) => {
  console.log("view class room req user id id ", req.user.id);
  let classroomsForLoggedInStudent = await StudentClassroom.find({student: req.user.id});

  res.status(200).json({
    status: "success",
    results: classroomsForLoggedInStudent.length,
    data: {
      classrooms: classroomsForLoggedInStudent,
    },
  });
});

exports.viewClassRoomPost = catchAsync(async (req, res, next) => {
  let enrolledStudents = await StudentClassroom.find({classroom: req.params.classroomId});

  //**this is just for safety check ***/
  let filteredStudent = enrolledStudents.filter(e => e.student.email == req.user.email);
  console.log("filteredStudent is ", filteredStudent);
  if(filteredStudent.length == 0){
    return next(new AppError("This student does not have permission in this classroom", 400));
  }

  let classroomPost = await ClassroomPost.find({ classroom: req.params.classroomId });

  res.status(200).json({
    status: "success",
    results: classroomPost.length,
    data: {
      classroomPost,
    },
  });
});

exports.createSubmission = catchAsync(async (req, res, next) => {
  let enrolledStudents = await StudentClassroom.find({classroom: req.body.classroomId});
  let filteredStudent = enrolledStudents.filter(e => e.student.email == req.user.email);
  console.log("filteredStudent is ", filteredStudent);
  if(!filteredStudent){
    return next(new AppError("This student is not allowed to submit in this classroom", 400));
  }

  let classroomPost = ClassroomPost.findOne({ _id: req.body.classroomPostId, classroom: req.body.classroomId });
  if(!classroomPost){
    return next(new AppError("This Classroom Post does not belong to the requested Classroom", 400));
  }
 
  console.log("uploaded file info is ", req.file);
  if (!req.file) {
    return next(new AppError("Please submit a valid document", 400));
  }
  const studentSubmission = await StudentSubmission.create({
    student: req.user.id,
    classroom: req.body.classroomId,
    classroomPost: req.body.classroomPostId,
    file: req.file.filename,
  });

  const savedSubmission = await studentSubmission.save();
  console.log("savedSubmission is " , savedSubmission)


  res.status(201).json({
    status: "success",
    data: {
      submissionInfo: savedSubmission
    },
  });
});

exports.viewResult = catchAsync(async (req, res, next) => {
  let enrolledStudents = await StudentClassroom.find({classroom: req.query.classroomId});

  //**this is just for safety check ***/
  let filteredStudent = enrolledStudents.filter(e => e.student.email == req.user.email);
  console.log("filteredStudent is ", filteredStudent);
  if(filteredStudent.length == 0){
    return next(new AppError("This student does not have permission to see the Result", 400));
  }

  let result = await Result.findOne({ classroom: req.query.classroomId, classroomPost: req.query.classroomPostId, student: req.user.id });
  if(!result){
    return next(new AppError("No Result found with the given query parameters", 400));
  }

  res.status(200).json({
    status: "success",
    result
  });
});