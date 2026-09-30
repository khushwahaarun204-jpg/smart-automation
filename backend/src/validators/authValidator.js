const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validateSignup = (req, res, next) => {
  const { name, email, password, role, department } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long',
      error: { code: 'INVALID_NAME' }
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
      error: { code: 'INVALID_EMAIL' }
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
      error: { code: 'WEAK_PASSWORD' }
    });
  }

  const validRoles = ['admin', 'manager', 'approver', 'employee'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role specified. Must be one of: ${validRoles.join(', ')}`,
      error: { code: 'INVALID_ROLE' }
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
      error: { code: 'INVALID_EMAIL' }
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      error: { code: 'MISSING_PASSWORD' }
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin
};
