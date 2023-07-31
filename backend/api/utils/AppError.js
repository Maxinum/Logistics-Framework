class AppError extends Error {
  /**
   * Create a new application-specific error.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    super(message);

    // Determine the status type based on the status code (4xx: fail, 5xx: error)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // The HTTP status code associated with the error
    this.statusCode = statusCode;

    // Flag indicating if the error is operational (i.e., caused by the application logic)
    this.isOperational = true;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
