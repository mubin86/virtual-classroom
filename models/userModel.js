const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'], // ***we can also maintain seperate Role model(table) if role type increase in future, 
                                            // and at that case we can just keep the role foreign key here for mapping
                                            // now, for simplicity maintaining this Enum
  
    // default: '' ***can also give any default role if necessary
  },
  active: {
    type: Boolean, //** we can use the soft delete concept by this */
    default: true,
    select: false
  }

});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model("User", userSchema); 

module.exports = User;