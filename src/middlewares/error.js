class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class BadRequest extends CustomError {
  constructor(message) {
    super(400, message);
  }
}

class ResourceNotFound extends CustomError {
  constructor(message) {
    super(404, message);
  }
}

class Unauthorized extends CustomError {
  constructor(message) {
    super(401, message);
  }
}

class Forbidden extends CustomError {
  constructor(message) {
    super(403, message);
  }
}

class Conflict extends CustomError {
  constructor(message) {
    super(409, message);
  }
}

class InvalidInput extends CustomError {
  constructor(errors) {
    super(422, errors);
    this.errors = errors;
  }
}

/**
 * Error handler middleware
 *
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void} Calls the next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // For debugging purposes, log the error stack
  // console.log(err.stack);

  const statusCode = err.statusCode || 500;

  const response = {
    status: err.status,
    statusCode,
  };
  if (err.errors) {
    response.errors = err.errors;
  } else {
    response.message = err.message || 'Internal Server Error';
  }

  res.status(statusCode).json(response);
};

module.exports = {
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  CustomError,
  errorHandler,
};
