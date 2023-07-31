// const mongoose = require("mongoose");
const collectionsEmitter = require("../../../bin/www");
const priceListsView = require("./price_list_currency_exchange");
const offersView = require("./offers_currency_exchange");
const PriceListWithOffersView = require("./offers_with_price_lists_currency_exchange");
const query = require("../../../utils/queries");
const chalk = require("chalk");

collectionsEmitter.on("collectionsReady", () => {
  console.log(chalk.yellow("Creating views..."));
  if (!process.collectionsList.includes("price_list_currency_exchange")) {
    priceListsView.db.createCollection("price_list_currency_exchange", {
      viewOn: "price_lists",
      pipeline: query.currencyExchangePriceList,
    });
    console.log(chalk.cyan("price_list_currency_exchange view created!"));
  } else {
    console.log(
      chalk.bgGreen("price_list_currency_exchange view already exists!")
    );
  }

  if (!process.collectionsList.includes("offers_currency_exchange")) {
    offersView.db.createCollection("offers_currency_exchange", {
      viewOn: "data_entries",
      pipeline: query.main,
    });
    console.log(chalk.cyan("offers_currency_exchange view created!"));
  } else {
    console.log(chalk.bgGreen("offers_currency_exchange view already exists!"));
  }
  if (
    !process.collectionsList.includes(
      "offers_with_price_lists_currency_exchange"
    )
  ) {
    PriceListWithOffersView.db.createCollection(
      "offers_with_price_lists_currency_exchange",
      {
        viewOn: "offers_currency_exchange",
        pipeline: query.offersWithPriceListsCurrencyExchange,
      }
    );
    console.log(
      chalk.cyan("offers_with_price_lists_currency_exchange view created!")
    );
  } else {
    console.log(
      chalk.bgGreen(
        "offers_with_price_lists_currency_exchange view already exists!"
      )
    );
  }
  console.log(chalk.green("Views created successfully!"));
});
