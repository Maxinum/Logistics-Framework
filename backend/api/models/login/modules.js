const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 40,
    required: true,
  },
});

const Modules = mongoose.model("modules", schema);

module.exports = Modules;
