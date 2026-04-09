const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ action, user, organization, targetType, targetId, details }) => {
  try {
    await ActivityLog.create({
      action,
      user,
      organization,
      targetType,
      targetId,
      details
    });
  } catch (error) {
    console.error('Logging failed:', error);
  }
};

module.exports = logActivity;
