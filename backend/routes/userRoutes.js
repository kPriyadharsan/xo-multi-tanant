const express = require('express');
const {
  getUsers,
  updateUserRole,
  removeUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// All users in org can list members
router.get('/', getUsers);

// Only admin can change roles or remove users
router.put('/:id/role', authorize('admin'), updateUserRole);
router.delete('/:id', authorize('admin'), removeUser);

module.exports = router;
