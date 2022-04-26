const crypto = require('crypto');
const User = require("../models/userModel"); //***it is actually the Teacher Model */
const Result = require("../models/resultModel"); 
const sendEmail = require('./../utils/email');
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError');
const ClassroomPost = require('../models/classroomPostModel');

exports.getAllTeacaher = catchAsync(async (req, res, next) => {
    const teachers = await User.find({role: "teacher"}).sort({createdAt: -1});

    res.status(200).json({
      status: "success",
      results: teachers.length,
      data: {
        teachers,
      },
    });
});

exports.getSpecificTeacher = catchAsync(async (req, res, next) => {
    const teacher = await User.findById(req.params.id);
    // or, User.findOne({ _id: req.params.id })
  
    if (!teacher) {
      return next(new AppError("No teacher found with that ID", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        teacher,
      },
    });
});

exports.createTeacaher = catchAsync(async (req, res, next) => {
  // const newTeacher = new Teacher({})
  // newTeacher.save() or, 
  
  const generatedPassword = crypto.randomBytes(12).toString('hex');
  console.log("generated password is ", generatedPassword);
  req.body.password = generatedPassword;
  req.body.role = "teacher"; //**for safety
  const message = `Congratulations you have been added in the Virtual Classroom as a Teacher.\n Please use this Password ${generatedPassword} to Login!`;

  const newTeacher = await User.create(req.body);
  try {
    const response = await sendEmail({
      email: newTeacher.email,
      subject: 'Virtual Classroom Password',
      message
    });

    if(response.code >= 400){
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
  } catch (err) {
    //Here we can take any decision(like delete the created user from the Db or can take any other action) according to the business logic
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }

  newTeacher.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      teacher: newTeacher,
    },
  });
});

exports.updateTeacaher = catchAsync(async (req, res, next) => {
    if (req.body.role && req.body.role != "teacher") {
        return next(new AppError("Invalid Arguments, Not allowed to perform this operation", 400));
    }

    const teacher = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    
      if (!teacher) {
        return next(new AppError("No teacher found with that ID", 404));
      }
    
      res.status(200).json({
        status: "success",
        data: {
            teacher,
        },
      });
});

exports.deleteTeacaher = catchAsync(async (req, res, next) => {
    const teacher = await User.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return next(new AppError("No teacher found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
});


exports.createResult = catchAsync(async (req, res, next) => {
  let classroomPost = await ClassroomPost.findById(req.body.classroomPostId);
  if(!classroomPost){
    return next(new AppError("No ClassroomPost found with that ID", 404));
  }

  const result = new Result({
    teacher: req.user.id,
    classroom: req.body.classroomId,
    classroomPost: req.body.classroomPostId,
    student: req.body.studentId,
    totalMarks: classroomPost.marks,
    obtainedMarks: req.body.obtainedMarks
  })

   let newResult = await result.save();

  res.status(201).json({
    status: "success",
    data: {
      result: newResult,
    },
  });
});