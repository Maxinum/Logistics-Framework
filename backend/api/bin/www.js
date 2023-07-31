const mongoose = require("mongoose");
const EventEmitter = require("events");
const chalk = require("chalk");

const app = require("../app");

const port = process.env.PORT;
process.env.NODE_ENV = "development";

app.listen(port, () => {
  console.log(chalk.green(`Starting to listen to the port: ${port}`));
});

const collectionsEmitter = new EventEmitter();
module.exports = collectionsEmitter;
require("../models/main/view/viewInspector");

mongoose.set("strictQuery", true);
console.log(chalk.yellow("Starting to connect to the MongoDB..."));
mongoose
  .connect(process.env.MONGOLINK, {
    useNewUrlParser: true,
  })
  .then(() => mongoose.connection.db.listCollections().toArray())
  .then((cursor) => {
    console.log(chalk.yellow("Getting collections list..."));
    const cursorLength = cursor.length;

    // Initialize an array to store the collections
    const collectionNames = [];

    cursor.forEach((value) => {
      collectionNames.push(value.name);
    });

    process.collectionsList = collectionNames;

    if (process.collectionsList.length === cursorLength) {
      console.log(chalk.green("Collections list ready!"));
      collectionsEmitter.emit("collectionsReady");
    }
    console.log(chalk.green("MongoDB connected successfully!"));
  });
