const express = require('express');
const { errorHandler } = require('./middlewares/error');
const morgan = require('morgan');
const router = require('./routers');

const app = express();

// Initialise middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', router);

// Error handling middlewares
app.use(errorHandler);
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: 'Not Found',
    statusCode: 404,
    message: `${req.method} ${req.url} not found`,
  });
});
module.exports = app;
