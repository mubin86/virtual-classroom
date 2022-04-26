const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//*********this is actually the TEACHER model ***////
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
    enum: {
      values: ['admin', 'teacher'], // we just keep the admin role here to indicate that we can manually give a script/insert-query for the admin role using this table
                                    // there is no endpoint or procedure to create an admin role from the api so it is secured
                                    // We can take of course any other approach for the role management according to the business need
      message: 'User is either: admin, teacher'
    }, // ***we can also maintain seperate Role model(table) if role type increase in future, 
                                            // and at that case we can just keep the role foreign key here for mapping
                                            // now, for simplicity maintaining this Enum
    default: 'teacher'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  active: {
    type: Boolean, //** we can use the soft delete concept by this */
    default: true,
    select: false
  }

});

// userSchema.pre(/^find/, function(next) {
//   this.find({ role: { $ne: 'admin' } });
//   next();
// });

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