const GlobalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Your token has expired. Please log in again.";
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    stack: err.stack,
  });
};

export default GlobalErrorHandler;
