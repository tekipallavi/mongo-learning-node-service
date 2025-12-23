// utils/appError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks this as a "known" error

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;


// middlewares/errorMiddleware.js
const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message };

  // 1. Handle MongoDB Cast Error (e.g., invalid ID)
  if (err.name === 'CastError') error = handleCastErrorDB(error);
  
  // 2. Handle MongoDB Duplicate Key (Code 11000)
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  
  // 3. Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

  // Send Response
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// utils/catchAsync.js
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // This 'next' sends the error to the global handler
  };
};

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getEmployeeDetails = catchAsync(async (req, res, next) => {
  const employee = await db.collection('employees').findOne({ employeeID: req.params.id });

  if (!employee) {
    // Manually trigger a 404
    return next(new AppError('No employee found with that ID', 404));
  }

  res.status(200).json(employee);
});

const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');

// ... routes ...

// Catch-all for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// The Error Handler MUST be the last middleware
app.use(globalErrorHandler);

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});