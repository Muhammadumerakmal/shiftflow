export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    error: message,
  });
}

// Custom error class services can throw with a specific HTTP status
export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
