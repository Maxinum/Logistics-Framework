const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema({
  invitationToken: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Invalid email... Please try again..."],
    required: true,
    unique: false,
  },
  confirmEmail: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.email;
      },
      message: "Emails are not the same! Please try again...",
    },
  },
  invitationTokenExpires: {
    type: Date,
    required: true,
  },
  invitationDate: {
    type: Date,
    default: Date.now(),
  },
  isEmailAcquired: {
    type: Boolean,
    default: false,
  },
  isUserRegistered: {
    type: Boolean,
    default: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  senderInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Invitations = mongoose.model("invitations", schema);

module.exports = Invitations;
