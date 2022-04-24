const mongoose = require("mongoose");

const studentClassroomSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: [true, 'Student Classroom must belong to a Student.']
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'Student Classroom must belong to a Classroom.']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
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