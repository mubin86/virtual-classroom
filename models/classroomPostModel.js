const mongoose = require("mongoose");

const classroomPostSchema = new mongoose.Schema({
  marks: {
    type: Number,
    required: [true, 'A Class Rom Post must have a marks property']
  },
  deadline: {
    type: Date,
    required: [true, 'A Class Rom Post must have a deadline property'],
  },
  taeacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'ClassroomPost must belong to a Teacher.']
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'ClassroomPost must belong to a Classroom.']
  },
  postType: {
    type: String,
    enum: {
        values: ['assignment', 'exam'],
        message: 'Post is either: assignment, exam'
    }
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }

});

classroomPostSchema.index({ taeacher: 1, classroom: 1 });

classroomPostSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'classroom',
      select: '-__v'
    }).populate({
      path: 'taeacher',
      select: '-__v email'
    });;
    next();
});

const ClassroomPost = mongoose.model("ClassroomPost", classroomPostSchema); 

module.exports = ClassroomPost;