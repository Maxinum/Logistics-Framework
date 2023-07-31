const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "data_entries",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "modules",
    },
  ],
});

const company = mongoose.model("companies", schema);

module.exports = company;
