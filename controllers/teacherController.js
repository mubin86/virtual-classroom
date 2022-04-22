const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllTeacaher = catchAsync(async (req, res, next) => {
    const teachers = await User.find({role: "teacher"});

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
  
  req.body.role = "teacher";
  const newTeacher = await User.create(req.body);

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
