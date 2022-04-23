const crypto = require('crypto');
const ClassroomPost = require("../models/classroomPostModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError');

exports.getAllClassRoomPost = catchAsync(async (req, res, next) => {
    let classroomPosts;
    if(req.query.teacherId && req.query.classroomId){
        classroomPosts = await ClassroomPost.find({teacher: req.query.teacherId, classroom: req.query.classroomId}) ;
    } else if(req.query.classroomId){
        classroomPosts = await ClassroomPost.find({classroom: req.query.classroomId}) ;
    } else{
        classroomPosts = await ClassroomPost.find() ;
    }

    res.status(200).json({
      status: "success",
      results: classroomPosts.length,
      data: {
        classroomPosts,
      },
    });
});

exports.getSingleClassRoomPost = catchAsync(async (req, res, next) => {
    const classroomPost = await ClassroomPost.findById(req.params.id);
    if (!classroomPost) {
      return next(new AppError("No classroomPost found with that ID", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: {
        classroomPost,
      },
    });
});

exports.createClassRoomPost = catchAsync(async (req, res, next) => {
  req.body.teacher = req.user.id;
  const newClassroomPost = await ClassroomPost.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
        classroomPost: newClassroomPost,
    },
  });
});

exports.updateClassRoomPost = catchAsync(async (req, res, next) => {
    const classroomPost = await ClassroomPost.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    
      if (!classroomPost) {
        return next(new AppError("No classroomPost found with that ID", 404));
      }
    
      res.status(200).json({
        status: "success",
        data: {
            classroomPost,
        },
      });
});


exports.deleteClassRoomPost  = catchAsync(async (req, res, next) => {
    const classroomPost = await ClassroomPost.findByIdAndDelete(req.params.id);
    if (!classroomPost) {
      return next(new AppError("No classroomPost found with that ID", 404));
    }
  
    res.status(204).json({
      status: "success",
      data: null
    });
});