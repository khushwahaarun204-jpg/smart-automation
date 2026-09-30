const AuthService = require('../services/authService');
const AuditLogModel = require('../models/auditLogModel');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  /**
   * POST /api/auth/signup
   */
  static async signup(req, res, next) {
    try {
      const { name, email, password, role, department } = req.body;
      const result = await AuthService.signup({
        name,
        email,
        password,
        role,
        department
      });

      return successResponse(res, 'Account created successfully', result, 201);
    } catch (err) {
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        return errorResponse(res, err.message, err.code, 409);
      }
      next(err);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      return successResponse(res, 'Logged in successfully', result, 200);
    } catch (err) {
      if (err.code === 'INVALID_CREDENTIALS') {
        return errorResponse(res, err.message, err.code, 401);
      }
      if (err.code === 'ACCOUNT_DEACTIVATED') {
        return errorResponse(res, err.message, err.code, 403);
      }
      next(err);
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return successResponse(res, 'User profile fetched successfully', { user }, 200);
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND' || err.code === 'ACCOUNT_DEACTIVATED') {
        return errorResponse(res, err.message, err.code, err.statusCode || 404);
      }
      next(err);
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    if (req.user?.id) {
      await AuditLogModel.log({
        userId: req.user.id,
        action: 'LOGOUT',
        resource: 'users',
        resourceId: req.user.id
      });
    }

    return successResponse(res, 'Logged out successfully', {});
  }
}

module.exports = AuthController;
