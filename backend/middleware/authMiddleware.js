const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Protect routes - Verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Get token from header (Bearer <token>) or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch user and attach to request
    // We use .lean() for performance, but we must use ._id afterwards
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user not found' 
      });
    }

    // Assign user to req object
    req.user = user;
    
    // For convenience in controllers, ensure id property exists even with lean()
    req.user.id = user._id.toString();

    next();
  } catch (err) {
    console.error(`Auth Middleware Error: ${err.message}`);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Your session has expired. Please log in again.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token is invalid' 
    });
  }
};

/**
 * @desc    Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
