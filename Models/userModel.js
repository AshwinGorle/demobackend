const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "A user must have a name"]
  },

  email: {
    type: String,
    validate: [validator.isEmail, "Enter a valid Email address"],
  },

  password: {
    type: String,
    minlength: 8,
    select:false
  },

  Enrollment_Number: {
    type: String,
    Unique: true,
  },

  branch:{
    type:String
  },

  session:{
    type:String
  },

  role: {
    type: String,
    enum: ["Admin", "Student"],
  },

  college: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model("user", userSchema, "users");

module.exports = userModel;
