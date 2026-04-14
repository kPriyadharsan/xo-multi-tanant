const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

/**
 * Custom key generator to identify users by both IP and User ID (if authenticated)
 * This ensures that even if users share an IP (behind NAT), they get individual limits
 */
const keyGenerator = (req) => {
  let userId = 'anonymous';
  
  // Try to get token from header or cookies
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // If token is invalid, we fall back to anonymous but we could also treat it as suspicious
    }
  }

  // Combine IP and UserId for the key
  return `${req.ip}_${userId}`;
};

/**
 * Standard handling for rate limit reached
 */
const handler = (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message || 'Too many requests, please try again later.',
    retryAfter: Math.ceil(options.windowMs / 1000 / 60) + ' minutes'
  });
};

// Global limiter for general API usage
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP/User to 200 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator,
  handler,
  validate: { 
    keyGeneratorIpFallback: false,
    ip: false
  },
  message: 'Too many requests from this user, please try again after 15 minutes'
});

// Stricter limiter for authentication routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 login/register attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  // For auth routes, we primarily stick to IP since they aren't logged in yet
  keyGenerator: (req) => req.ip,
  handler,
  validate: { 
    keyGeneratorIpFallback: false,
    ip: false
  },
  message: 'Too many authentication attempts, please try again after an hour'
});

// Limiter for AI tokens (if applicable, as AI calls are expensive)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit AI requests to 50 per hour per user
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler,
  validate: { 
    keyGeneratorIpFallback: false,
    ip: false
  },
  message: 'AI request limit reached for this hour'
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter
};
