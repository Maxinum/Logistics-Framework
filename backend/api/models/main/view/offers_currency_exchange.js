const mongoose = require("mongoose");

const schema = mongoose.Schema({}, { autoCreate: false, autoIndex: false });
const offersView = mongoose.model(
  "offers_currency_exchange",
  schema,
  "offers_currency_exchange"
);

module.exports = offersView;
