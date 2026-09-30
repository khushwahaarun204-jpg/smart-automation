const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/userModel');
const AuditLogModel = require('../models/auditLogModel');

class AuthService {
  /**
   * Generate JWT authentication token
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  /**
   * Register a new user
   */
  static async signup({ name, email, password, role = 'employee', department = null }) {
    // 1. Check if user already exists
    const emailExists = await UserModel.existsByEmail(email);
    if (emailExists) {
      const err = new Error('An account with this email address already exists');
      err.statusCode = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }

    // 2. Hash password with bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create user in database
    const newUser = await UserModel.create({
      name,
      email,
      passwordHash,
      role,
      department
    });

    // 4. Generate JWT
    const token = this.generateToken(newUser);

    // 5. Track audit log
    await AuditLogModel.log({
      userId: newUser.id,
      action: 'USER_SIGNUP',
      resource: 'users',
      resourceId: newUser.id,
      metadata: { role: newUser.role, department: newUser.department }
    });

    return {
      user: newUser,
      token
    };
  }

  /**
   * Authenticate user with email and password
   */
  static async login({ email, password }) {
    // 1. Find user by email
    const user = await UserModel.findByEmailWithPassword(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    // 2. Check if account is active
    if (!user.is_active) {
      const err = new Error('Your account has been deactivated. Please contact your administrator.');
      err.statusCode = 403;
      err.code = 'ACCOUNT_DEACTIVATED';
      throw err;
    }

    // 3. Compare password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    // 4. Extract safe user object (omit password_hash)
    const { password_hash, ...safeUser } = user;

    // 5. Generate token
    const token = this.generateToken(safeUser);

    // 6. Log audit event
    await AuditLogModel.log({
      userId: safeUser.id,
      action: 'LOGIN',
      resource: 'users',
      resourceId: safeUser.id,
      metadata: { role: safeUser.role }
    });

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Retrieve current authenticated user profile
   */
  static async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (!user.is_active) {
      const err = new Error('Account deactivated');
      err.statusCode = 403;
      err.code = 'ACCOUNT_DEACTIVATED';
      throw err;
    }

    return user;
  }
}

module.exports = AuthService;
