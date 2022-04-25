const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    unique: true,
    minlength: 5
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  schoolId: {
    type: Number,
    minlength: 5,
    required: [true, 'A student must have a School Id']
  },
  role: {
    type: String,
    enum: {
        values: ['student'], 
        message: 'User must be student'
    },
    default: 'student'
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

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.correctPassword = async function (
  candidatePassword,
  studentPassword
) {
  return await bcrypt.compare(candidatePassword, studentPassword);
};

const Student = mongoose.model("Student", studentSchema); 

module.exports = Student;