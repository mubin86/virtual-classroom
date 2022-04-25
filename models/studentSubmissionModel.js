const mongoose = require("mongoose");

const studentSubmissionSchema = new mongoose.Schema({
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
  file: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

studentSubmissionSchema.index({ student: 1, classroom: 1, classroomPost: 1 });

studentSubmissionSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'student',
      select: '-__v -password'
    }).populate({
      path: 'classroom',
      select: '-__v'
    }).populate({
       path: 'classroomPost',
       select: 'marks deadline'
    });
    next();
});

const StudentSubmission = mongoose.model("StudentSubmission", studentSubmissionSchema); 

module.exports = StudentSubmission;