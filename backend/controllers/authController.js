const User = require('../models/User');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, organizationName, organization: organizationAlias, organizationId, expectedRole } = req.body;
    const finalOrgName = organizationName || organizationAlias;

    // Validate required fields
    if (!name || !email || !password || !finalOrgName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, password, and organization name' 
      });
    }

    // Check if organization exists
    let organization = await Organization.findOne({ name: finalOrgName });
    let role = 'admin';

    if (organization) {
      // Must provide exact ID to join an existing workspace
      if (!organizationId || organization._id.toString() !== organizationId) {
         return res.status(401).json({
            success: false,
            message: 'To join an existing workspace, the Workspace Name and ID must match perfectly.'
         });
      }
      role = expectedRole || 'member'; // Access will go for member/manager based on what's configured, default member
    } else {
      if (organizationId) {
         return res.status(400).json({
            success: false,
            message: 'No existing workspace found with that Name to match the provided ID.'
         });
      }
      // Create new organization
      organization = await Organization.create({
        name: finalOrgName,
        slug: finalOrgName.toLowerCase().split(' ').join('-')
      });
      role = 'admin'; // First user is admin
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      organization: organization._id,
      role: role,
      lastIp: req.ip,
      lastLogin: new Date()
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('organization');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login and IP
    user.lastLogin = new Date();
    user.lastIp = req.ip;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user is already set by protect middleware
    const user = await User.findById(req.user._id).populate('organization');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, profileImage } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (profileImage) updates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).populate('organization');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        lastIp: user.lastIp,
        lastLogin: user.lastLogin
      }
    });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
