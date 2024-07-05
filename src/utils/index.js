const jwt = require('jsonwebtoken');

/**
 *
 * @param {string} token
 * @returns
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    // throw new
  }
};

module.exports = {
  verifyToken,
};
