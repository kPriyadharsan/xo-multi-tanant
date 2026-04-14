const User = require('../models/User');

// @desc    Get all users in organization
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ organization: req.user.organization });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin Only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'manager', 'member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure user is in the same organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove user from organization
// @route   DELETE /api/users/:id
// @access  Private (Admin Only)
const removeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure user is in the same organization
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  removeUser
};
