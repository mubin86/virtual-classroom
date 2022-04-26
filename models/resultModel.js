const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Result must belong to a Tacher.']
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'Result must belong to a Classroom.']
  },
  classroomPost: {
    type: mongoose.Schema.ObjectId,
    ref: 'ClassroomPost',
    required: [true, 'Result must belong to a ClassroomPost.']
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: [true, 'Result must belong to a Student']
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

resultSchema.index({ student: 1, classroom: 1, classroomPost: 1 });

resultSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'student',
      select: '-__v -password'
    }).populate({
      path: 'classroom',
      select: '-__v'
    }).populate({
        path: 'classroomPost',
        select: '-__v'
    });
    next();
});

const Result = mongoose.model("Result", resultSchema); 

module.exports = Result;