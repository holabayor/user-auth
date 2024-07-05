/**
 * Middleware to check if the user is authenticated
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Object} - Response object
 * @throws {Object} - Error object
 *
 */
const auth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'You must be logged in to access this resource' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
