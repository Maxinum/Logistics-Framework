const axios = require("axios");
const CurrencyModel = require("../models/main/currencies");
const CurrencyHistoryModel = require("../models/main/currenciesHistory");

/**
 * Fetches the latest currency data from the API.
 * @returns {Promise<Object>} - The currency data.
 */
const getCurrencies = async () => {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const currency = response.data;

    console.log(`Get currencies success \n${new Date()}`);

    return currency;
  } catch (error) {
    console.log(`Get currencies failed \n${new Date()}`);
    throw error;
  }
};

/**
 * Updates the currencies in the database with the latest data from the API.
 */
const updateCurrencies = async () => {
  try {
    const { rates } = await getCurrencies();
    const ratesArray = Object.entries(rates).map(([currency_code, rate]) => ({
      currency_code,
      rate,
    }));
    const data = { rates: ratesArray };

    // Delete existing CurrencyModel objects
    await CurrencyModel.deleteMany();

    // Save new CurrencyModel object
    await CurrencyModel.create(data);
    await CurrencyHistoryModel.create(data);

    console.log(`[INFO!] Create currencies success \n${new Date()}`);
    console.log(`[INFO!] Create currencies history success \n${new Date()}`);
  } catch (error) {
    console.log(`[INFO!] Create currencies failed \n${new Date()}`);
    throw error;
  }
};

module.exports = updateCurrencies;
