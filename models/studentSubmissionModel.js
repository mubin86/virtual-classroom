const mongoose = require("mongoose");

const studentClassroomSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: [true, 'Submission must belong to a Student.']
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'Submission must belong to a Classroom.']
  },
  classroomPost: {
    type: mongoose.Schema.ObjectId,
    ref: 'ClassroomPost',
    required: [true, 'Submission must belong to a Classroom Post']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  file: {
      type: String
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

studentClassroomSchema.index({ student: 1, classroom: 1 });

studentClassroomSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'student',
      select: '-__v -password'
    }).populate({
      path: 'classroom',
      select: '-__v'
    });
    next();
});

const StudentClassroom = mongoose.model("StudentClassroom", studentClassroomSchema); 

module.exports = StudentClassroom;