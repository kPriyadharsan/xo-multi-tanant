const Notification = require('../models/Notification');

/**
 * Creates a notification in the database and emits it via socket.io
 * 
 * @param {Object} io - The socket.io instance
 * @param {Object} notificationData - { user, organization, title, message, type }
 */
const sendNotification = async (io, notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    
    if (io) {
      io.to(`user_${notificationData.user}`).emit('newNotification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

/**
 * Broadcasts a notification to multiple users
 */
const sendNotificationToMultiple = async (io, users, organization, title, message, type = 'info') => {
  try {
    const notifications = await Promise.all(
      users.map(userId => 
        Notification.create({
          user: userId,
          organization,
          title,
          message,
          type
        })
      )
    );

    if (io) {
      notifications.forEach(notification => {
        io.to(`user_${notification.user}`).emit('newNotification', notification);
      });
    }

    return notifications;
  } catch (error) {
    console.error('Error sending multiple notifications:', error);
  }
};

module.exports = {
  sendNotification,
  sendNotificationToMultiple
};
