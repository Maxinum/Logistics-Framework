const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Helper = require("../../utils/Helpers");
// const slugify = require("slugify");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name have to be provided"],
    maxLenght: 20,
  },
  surname: {
    type: String,
    required: [true, "Surname have to be provided"],
    maxLenght: 20,
  },
  email: {
    type: String,
    required: [true, "Email have to be provided"],
    validate: [validator.isEmail, "Invalid email... Please try again..."],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password have to be provided"],
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
        });
      },
      message: "Password must be strong",
    },
    maxLenght: 40,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password have to be provided"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same! Please try again...",
    },
    minLenght: 8,
    maxLenght: 25,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  passwordChagedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChagedAt = Date.now() - 2000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChagedAt) {
    const changedTimestamp = parseInt(
      this.passwordChagedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = new Helper().getHexRandomBytes();

  this.passwordResetToken = new Helper().getHashedToken(token);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
