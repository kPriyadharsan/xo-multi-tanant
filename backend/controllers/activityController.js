const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res, next) => {
  try {
    let query;

    // Organization filter (Strict Isolation)
    if (req.user.role === 'admin') {
      // Admin sees everything in org
      query = ActivityLog.find({ organization: req.user.organization })
        .populate('user', 'name email')
        .sort('-createdAt');
    } else {
      // Member sees only their own activity
      query = ActivityLog.find({
        organization: req.user.organization,
        user: req.user.id
      })
      .populate('user', 'name email')
      .sort('-createdAt');
    }

    const logs = await query.limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs };
