const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Student not found";
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
