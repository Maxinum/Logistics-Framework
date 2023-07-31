const AppError = require("../utils/AppError");

/**
 * Handles CastError by creating an appropriate error message.
 *
 * @param {Error} err - The CastError object
 * @returns {AppError} - An instance of the AppError class
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

/**
 * Handles DuplicateError by creating an appropriate error message.
 *
 * @param {Error} err - The DuplicateError object
 * @returns {AppError} - An instance of the AppError class
 */
const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate field value: (${err.keyValue.name}). Please use a different value.`;

  return new AppError(message, 400);
};

/**
 * Handles ValidationError by creating an appropriate error message.
 *
 * @param {Error} err - The ValidationError object
 * @returns {AppError} - An instance of the AppError class
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles JsonWebTokenError by creating an appropriate error message.
 *
 * @returns {AppError} - An instance of the AppError class
 */
const handleJsonWebTokenErrorDB = () =>
  new AppError(`Invalid token. Please authorize again`, 401);

/**
 * Handles TokenExpiredError by creating an appropriate error message.
 *
 * @returns {AppError} - An instance of the AppError class
 */
const handleTokenExpiredErrorDB = () =>
  new AppError(`Token has expired. Please log in again`, 401);

/**
 * Sends error response in the development environment.
 *
 * @param {AppError} err - The error object
 * @param {object} res - The response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Sends error response in the production environment.
 *
 * @param {AppError} err - The error object
 * @param {object} res - The response object
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

/**
 * Express error handling middleware function.
 *
 * @param {Error} err - The error object
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {Function} next - The next middleware function
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // Development environment
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Production environment

    let error = Object.assign({}, ...err);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenErrorDB(error);
    if (error.name === "TokenExpiredError")
      error = handleTokenExpiredErrorDB(error);

    sendErrorProd(error, res);
  }
};
