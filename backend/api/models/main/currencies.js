const mongoose = require("mongoose");

const schema = mongoose.Schema({
  rates: [
    {
      currency_code: {
        type: String,
      },
      rate: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
}) ;

const currency = mongoose.model("currencies", schema);

module.exports = currency;
