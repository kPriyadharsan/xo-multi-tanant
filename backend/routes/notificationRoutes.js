const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');

// Apply protection to all notification routes
router.use(protect);

router.route('/')
  .get(getNotifications)
  .delete(deleteNotification); // to handle delete 'all' we'll route to /:id but actually our controller expects /all. Wait...

// Actually let's just make the routes like this:
router.route('/:id')
  .delete(deleteNotification);

// for marking as read
router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
