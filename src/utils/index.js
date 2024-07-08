const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Forbidden, InvalidInput } = require('../middlewares/error');

/**
 * Verifies a JSON Web Token
 *
 * @param {string} JSON Web Token string
 * @returns {Object} decoded token
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Forbidden('Invalid or expired token');
  }
};

/**
 * Hashes a password with bcrypt
 *
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 *
 * @param {string} password - plain text password
 * @param {string} hashedPassword - hashed password to be compared with
 * @returns {Promise<boolean>} true if password matches hashed password, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Validates data against a Joi schema
 *
 * @param {Object} - Joi schema to validate data against
 * @param {Object} - data to validate against the schema
 * @returns void
 */
const validateSchema = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message,
    }));
    throw new InvalidInput(errors);
  }
};

/**
 * Generates a JSON Web Token
 *
 * @param {object} payload  - data to be signed into the token
 * @returns {string} - JSON Web Token string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' }); // Token expires in 1 hour
};

/**
 * An async wrapper for route handlers that catches errors
 *
 * @param {Function} fn - The asynchronous route handler function to wrap.
 * @returns {Function} A function that wraps the route handler and catches errors.
 */
const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  verifyToken,
  validateSchema,
  asyncWrapper,
  generateToken,
  comparePassword,
  hashPassword,
};
