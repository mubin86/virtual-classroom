const mongoose = require("mongoose");

const classroomPostSchema = new mongoose.Schema({
  marks: {
    type: Number,
    required: [true, 'A Class Room Post must have a marks property']
  },
  deadline: {
    type: Date,
    required: [true, 'A Class Room Post must have a deadline property'],
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Class Room Post must belong to a Teacher.']
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'Class Room Post must belong to a Classroom.']
  },
  postType: {
    type: String,
    enum: {
        values: ['assignment', 'exam'],
        message: 'Post is either: assignment, exam'
    }
  },
  isEmailSent: {
    type: Boolean,
    default: false,
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

classroomPostSchema.index({ classroom: 1 });

classroomPostSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'classroom',
      select: '-__v'
    });
    next();
});

const ClassroomPost = mongoose.model("ClassroomPost", classroomPostSchema); 

module.exports = ClassroomPost;