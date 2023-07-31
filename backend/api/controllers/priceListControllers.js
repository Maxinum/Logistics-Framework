const priceListModel = require("../models/main/priceList");
const catchAsync = require("../utils/CatchAsync");
const FilterApi = require("../utils/FilterApi");
const AppError = require("../utils/AppError");
const Helper = require("../utils/Helpers");
const priceListWithCurrencyExchangeModel = require("../models/main/view/price_list_currency_exchange");

/**
 Inserts data into the priceList collection.
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @param {Function} next - The next middleware function.
 @returns {Object} JSON object with status, message, and data properties.
 */
exports.insertData = catchAsync(async (req, res, next) => {
  const { valid_from, valid_until, ...requestData } = req.body;

  const excludedKeys = [
    "details",
    "valid_from",
    "valid_until",
    "senderInformation",
  ];

  const filter = Object.entries(requestData)
    .filter(([key]) => !excludedKeys.includes(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  filter.valid_from = { $gte: new Date(valid_from) };
  filter.valid_until = { $lte: new Date(valid_until) };

  // Check if a document with the same filter exists
  const existingDoc = await priceListModel.findOne(filter);

  if (existingDoc) {
    return res.status(400).json({
      status: "fail",
      message: "A valid interval already exists for the provided dates.",
      data: existingDoc,
    });
  }

  // Create a new price list document
  const priceList = await priceListModel.create(req.body);

  res.status(200).json({
    status: "success",
    message: "New price list document created successfully.",
    data: priceList,
  });
});

/**

 Retrieves all data from the priceList collection with optional filtering, sorting, limiting, paginating, and faceting.
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @param {Function} next - The next middleware function.
 @returns {Object} JSON object with status, code, data, and results properties.
 */
exports.getAllData = catchAsync(async (req, res, next) => {
  // Create a FilterApi object with the request query and relevant collection name
  const api = new FilterApi(req.query, "", "empty", req.headers.company)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .facet();
  // Perform an aggregate query with the constructed pipeline
  const priceList = await priceListWithCurrencyExchangeModel.aggregate(
    api.pipeline
  );

  // Get count from the database answer object
  const count = priceList[0].totalCount.count;

  // Remove the totalCount field from the result
  delete priceList[0].totalCount;

  res.status(201).json({
    status: "success",
    code: 201,
    data: priceList[0].offer,
    results: count,
  });
});

/**

 Archives a price list document by setting its activity field to "Archive".
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @param {Function} next - The next middleware function.
 @returns {Object} JSON object with status property.
 @throws {AppError} If the price list document is not found.
 */
exports.archiveData = catchAsync(async (req, res, next) => {
  // Find and update the price list document with the provided id
  const priceList = await priceListModel.findByIdAndUpdate(req.params.id, {
    activity: "Archive",
  });
  // If the price list document is not found, throw an error
  if (!priceList) {
    next(new AppError("Price list not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

/**

 Restores an archived price list document by setting its activity field to "Active".
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @param {Function} next - The next middleware function.
 @returns {Object} JSON object with status property.
 @throws {AppError} If the price list document is not found.
 */
exports.restoreData = catchAsync(async (req, res, next) => {
  // Find and update the price list document with the provided id
  const priceList = await priceListModel.findByIdAndUpdate(req.params.id, {
    activity: "Active",
  });
  // If the price list document is not found, throw an error
  if (!priceList) {
    next(new AppError("Price list not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

/**

 Retrieves free intervals from the priceList collection based on the provided category.
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @param {Function} next - The next middleware function.
 @returns {Object} JSON object with status and data properties.
 @throws {AppError} If the query object does not have the category field.
 */
exports.getFreeIntervals = catchAsync(async (req, res, next) => {
  // Check if the query object has the category field
  if (!req.query.category)
    return next(new AppError("Query object must have category field", 404));
  // Create a FilterApi object with the request query and relevant collection name, and apply the freeInterval method
  const api = new FilterApi(
    req.query,
    "",
    "freeIntervals",
    req.headers.company
  ).freeInterval();

  // Perform an aggregate query with the constructed pipeline
  const priceList = await priceListModel.aggregate(api.pipeline);

  res.status(200).json({
    status: "success",
    data: priceList,
  });
});

exports.patchData = catchAsync(async (req, res, next) => {
  const { valid_from, valid_until, ...requestData } = req.body;

  const excludedKeys = [
    "details",
    "valid_from",
    "valid_until",
    "senderInformation",
    "total_price_40_usd",
    "total_price_20_usd",
  ];

  let filter = Object.entries(requestData)
    .filter(([key]) => !excludedKeys.includes(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  filter.valid_from = { $gte: new Date(valid_from) };
  filter.valid_until = { $lte: new Date(valid_until) };
  filter._id = req.params.id;

  filter = new Helper().setCorrectTypesForAggregate(filter);
  filter._id = { $ne: filter._id };

  console.log(filter);

  const existingDoc = await priceListModel.findOne(filter);

  if (existingDoc) {
    return res.status(400).json({
      status: "fail",
      message: "A valid interval already exists for the provided dates.",
      data: existingDoc,
    });
  }

  const updatedDocument = await priceListModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { runValidators: true, context: "query" }
  );

  if (!updatedDocument) {
    return next(new AppError("Offer not found", 404));
  }

  res.status(200).json({
    status: "success",
    code: 200,
  });
});

exports.getDistinctData = catchAsync(async (req, res, next) => {
  const keys = req.query.distinct.split(",");
  const results = {};
  const setResult = async (key) => {
    const api = new FilterApi(
      priceListModel.distinct(),
      key,
      "main",
      req.body.company
    ).unique();
    results[key] = await api.queryString;
  };

  await Promise.all(keys.map(setResult));

  if (Object.keys(results).length === 0) {
    return next(new AppError("Something went wrong", 404));
  }

  res.status(200).json({
    status: "success",
    code: 200,
    data: results,
    results: keys.length,
  });
});
