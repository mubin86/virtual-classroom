const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  photo: String,
  role: {
    type: String,
    enum: ['teacher'], // ***we can also maintain seperate Role model(table) if role type increase in future, 
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

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;