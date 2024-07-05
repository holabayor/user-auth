const { verifyToken } = require('../utils');

/**
 * Middleware to check if the user is authenticated
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Object} - Response object
 * @throws {Object} - Error object
 *
 */
const authenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    if (!req.user) {
      req.user = {};
    }
    req.user.id = decoded.userId;
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticated;
