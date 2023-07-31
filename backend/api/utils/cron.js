const cron = require("node-cron");

const currencyParser = require("./currencyParser");

cron.schedule("0 0 * * *", async () => {
  await currencyParser();
});
