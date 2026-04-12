const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // Step 1: Verify the JWT token (no DB call here)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT Verify Error:', jwtError.message);
      return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
    }

    // Step 2: Fetch user from DB (separate try-catch so DB errors don't look like auth errors)
    try {
      req.user = await User.findById(decoded.id).lean();
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (dbError) {
      console.error('DB Error in auth middleware:', dbError.message);
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
