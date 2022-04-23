const crypto = require('crypto');
const Classroom = require("../models/classroomModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError');

exports.getAllClassRoom = catchAsync(async (req, res, next) => {
    let classrooms;
    if(req.query.teacherId){
        classrooms = await Classroom.find({teacher: req.query.teacherId}) ;
    }else{
        classrooms = await Classroom.find() ;
    }

    res.status(200).json({
      status: "success",
      results: classrooms.length,
      data: {
        classrooms,
      },
    });
});

exports.getSingleClassRoom = catchAsync(async (req, res, next) => {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return next(new AppError("No classroom found with that ID", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        classroom,
      },
    });
});

exports.createClassRoom = catchAsync(async (req, res, next) => {
  req.body.code = crypto.randomBytes(10).toString('hex');
  req.body.teacher = req.user.id;
  const newClassroom = await Classroom.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
        classroom: newClassroom,
    },
  });

});


exports.deleteClassRoom  = catchAsync(async (req, res, next) => {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return next(new AppError("No classroom found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null,
    });
});
