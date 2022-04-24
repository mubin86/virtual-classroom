const crypto = require('crypto');
const Student = require("../models/studentModel");
const Classroom = require("../models/classroomModel");
const StudentClassroom = require("../models/studentClassroomModel");
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
    let classroom = await Classroom.findOne({code: req.body.code});
    if(!classroom){
        return next(new AppError("No Classroom found with the requested code", 400));
    }
  
    const newStudent = new Student({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        schoolId: req.body.schoolId
    })
    let savedStudent = await newStudent.save();

    const newStudentEnrolledClass =  new StudentClassroom({
       student: newStudent._id,
       classroom: classroom._id
    })
    let enrolledStudentInClass =  await newStudentEnrolledClass.save();

    savedStudent.password = undefined;
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
