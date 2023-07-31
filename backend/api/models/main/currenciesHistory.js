const mongoose = require("mongoose");

const schema = mongoose.Schema({
  rates: [
    {
      currency_code: {
        type: String,
      },
      currency_rate: {
        type: Number,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const currencyHistory = mongoose.model("currency_history", schema);

module.exports = currencyHistory;
