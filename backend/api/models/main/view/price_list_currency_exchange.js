const mongoose = require("mongoose");

const schema = mongoose.Schema({}, { autoCreate: false, autoIndex: false });
const priceListsView = mongoose.model(
  "price_list_currency_exchange",
  schema,
  "price_list_currency_exchange"
);

module.exports = priceListsView;
