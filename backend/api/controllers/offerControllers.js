const offerModel = require(`../models/main/offer`);
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/CatchAsync");
const FilterApi = require("../utils/FilterApi");
const Helper = require("../utils/Helpers");
const CompanyModel = require("../models/login/company");
const OffersWithCurrencyExchangeModel = require("../models/main/view/offers_currency_exchange");
const offersWithPriceListModel = require("../models/main/view/offers_with_price_lists_currency_exchange");
//Отправка оффера в базу данных
/**
 * Insert data into the offerModel collection.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.insertData = catchAsync(async (req, res, next) => {
  const newOffer = await offerModel.create(req.body);
  const company = await CompanyModel.findById(req.headers.company);
  company.offers.push(newOffer._id);
  company.save();

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      newOffer,
    },
  });
});

/**
 * Get all offers with optional keyword-based filtering.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.getAllData = catchAsync(async (req, res, next) => {
  const api = new FilterApi(req.query, "", "empty", req.headers.company)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .facet();
  const offer = await offersWithPriceListModel.aggregate(api.pipeline);
  // const offer = await OffersWithCurrencyExchangeModel.find();
  // Get count from the database answer object
  // eslint-disable-next-line prefer-destructuring
  const count = offer[0].totalCount.count;
  // Remove the totalCount field from the result
  delete offer[0].totalCount;

  res.status(201).json({
    status: "success",
    code: 201,
    data: offer[0].offer,
    results: count,
  });
});

/**
 * Get distinct values for specified keys in the offerModel collection.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.getDistinctData = catchAsync(async (req, res, next) => {
  const keys = req.query.distinct.split(",");
  const results = {};
  const setResult = async (key) => {
    const api = new FilterApi(
      offerModel.distinct(),
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

/**
 * Update an offer.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.patchData = catchAsync(async (req, res, next) => {
  const oldDocument = await offerModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      context: "query",
      returnOriginal: true,
    }
  );

  if (!oldDocument) {
    return next(new AppError("Offer not found", 404));
  }

  new Helper().createHistoryCopy(oldDocument);

  res.status(200).json({
    status: "success",
    code: 200,
  });
});

/**
 * Archive an offer.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.archiveData = catchAsync(async (req, res, next) => {
  const offer = await offerModel.findByIdAndUpdate(req.params.id, {
    activity: "Archived",
  });

  if (!offer) {
    next(new AppError("Offer not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

/**
 * Restore an archived offer.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.restoreData = catchAsync(async (req, res, next) => {
  const offer = await offerModel.findByIdAndUpdate(req.params.id, {
    activity: "Active",
  });

  if (!offer) {
    next(new AppError("Offer not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});
