const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'An unique code is required for creating a classroom'],
    unique: true,
    minlength: 8
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Classroom must belong to a Teacher.']
  },
  active: {
    type: Boolean, //** we can use the soft delete concept by this */
    default: true,
    select: false
  }
});

classroomSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'teacher',
      select: '-__v email'
    });
    next();
});

const Classroom = mongoose.model("Classroom", classroomSchema); 

module.exports = Classroom;