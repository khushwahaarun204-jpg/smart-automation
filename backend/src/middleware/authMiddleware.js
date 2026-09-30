const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorResponse } = require('../utils/response');

/**
 * JWT Authentication Middleware
 * Validates 'Authorization: Bearer <token>' header
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required. Please log in.', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 'TOKEN_EXPIRED', 401);
    }
    return errorResponse(res, 'Invalid authentication token.', 'INVALID_TOKEN', 401);
  }
};

/**
 * Role-Based Authorization Guard
 * Never trusts role from frontend, checks verified req.user.role
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res, 
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`, 
        'FORBIDDEN', 
        403
      );
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  authenticate: authMiddleware,
  requireRole
};
