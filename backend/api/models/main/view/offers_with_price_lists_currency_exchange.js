const mongoose = require("mongoose");

const schema = mongoose.Schema({}, { autoCreate: false, autoIndex: false });
const offersWithPriceListView = mongoose.model(
  "offers_with_price_lists_currency_exchange",
  schema,
  "offers_with_price_lists_currency_exchange"
);

module.exports = offersWithPriceListView;
