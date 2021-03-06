const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'An unique code is required for creating a classroom'],
    unique: true,
    minlength: 10
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Classroom must belong to a Teacher.']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  active: {
    type: Boolean, //** soft delete */
    default: true,
    select: false
  }
});

classroomSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

classroomSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'teacher',
      select: '-__v -role'
    });
    next();
});

const Classroom = mongoose.model("Classroom", classroomSchema); 

module.exports = Classroom;