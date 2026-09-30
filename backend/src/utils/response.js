/**
 * Standardized API response helpers adhering to Rule 44:
 * Success: { success: true, message: string, data: any }
 * Failure: { success: false, message: string, error: { code: string, details?: any } }
 */

const successResponse = (res, message = 'Operation successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Something went wrong', code = 'INTERNAL_ERROR', statusCode = 500, details = null) => {
  const errorObj = { code };
  if (details && process.env.NODE_ENV !== 'production') {
    errorObj.details = details;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorObj
  });
};

module.exports = {
  successResponse,
  errorResponse
};
