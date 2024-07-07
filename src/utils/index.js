const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Forbidden, InvalidInput } = require('../middlewares/error');

/**
 *
 * @param {string} JSON Web Token string
 * @returns Promise, decoded token object
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
 *
 * @param {string} password
 * @returns Promise, generated hash for the given string
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 *
 * @param {string} password - plain text password
 * @param {string} hashedPassword - hashed password to be compared with
 * @returns Promise<boolean>
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 *
 * @param {object} Joi schema to validate data against
 * @param {object} data to be validated
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
 *
 * @param {object} payload  - data to be signed into the token
 * @returns JSON Web Token string
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' }); // Token expires in 1 hour
};

/**
 *
 * @param {method} fn
 * @returns Promise
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
