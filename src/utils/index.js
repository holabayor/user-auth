const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Forbidden, InvalidInput } = require('../middlewares/error');

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
    throw new Forbidden('Invalid or expired token');
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

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
// Function to generate a JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' }); // Token expires in 1 hour
};

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
