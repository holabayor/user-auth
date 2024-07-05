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
  constructor(message) {
    super(422, message);
  }
}

const errorHandler = (err, req, res, next) => {
  // For debugging purposes, log the error stack
  // console.log(err.stack);

  const status = err.status;
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status,
    statusCode,
    message: err.message || 'Internal Server Error',
  });
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
