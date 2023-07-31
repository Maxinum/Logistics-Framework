/**
 * Create an error-handling middleware wrapper.
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - The middleware function.
 */
module.exports = function (fn) {
  /**
   * Middleware function for error handling.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware function.
   */
  return (req, res, next) => {
    // Execute the provided async function and handle any errors
    fn(req, res, next).catch(next);
  };
};
