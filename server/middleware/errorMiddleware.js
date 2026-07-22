const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  let message = err.message || "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Duplicate email
  if (err.code === 11000) {
    statusCode = 409;
    message = "An account with this email already exists.";
  }

  // Multer upload errors
  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File must be 5 MB or smaller."
        : "Invalid file upload.";
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid request data.";
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
