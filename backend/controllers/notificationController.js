const Notification = require('../models/Notification');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ 
      user: req.user._id,
      organization: req.user.organization
    }).sort({ createdAt: -1 }).limit(50); // limit to 50 latest

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a single notification or all as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    if (req.params.id === 'all') {
      await Notification.updateMany(
        { user: req.user._id, organization: req.user.organization, read: false },
        { read: true }
      );
      return res.status(200).json({ success: true, data: [] });
    } else {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { read: true },
        { new: true, runValidators: true }
      );

      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }

      return res.status(200).json({ success: true, data: notification });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    let query = { user: req.user._id, organization: req.user.organization };
    
    if (req.params.id !== 'all') {
      query._id = req.params.id;
      const notification = await Notification.findOne(query);
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      await notification.deleteOne();
    } else {
      // Delete all
      await Notification.deleteMany(query);
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
