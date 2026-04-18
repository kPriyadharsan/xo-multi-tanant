const Task = require('../models/Task');
const logActivity = require('../utils/logger');
const { sendNotificationToMultiple } = require('../utils/notificationService');

// @desc    Get all tasks for user/organization
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let query;

    // Organization filter (Strict Isolation)
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      // Admin and Manager sees everything in org
      query = Task.find({ organization: req.user.organization }).populate('assignedTo').lean();
    } else {
      // Member sees only their tasks (assigned or created)
      query = Task.find({
        organization: req.user.organization,
        $or: [
          { assignedTo: req.user.id },
          { createdBy: req.user.id }
        ]
      }).populate('assignedTo').lean();
    }

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo').lean();

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Strict Isolation check
    if (task.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
    }

    // RBAC: Check visibility if not admin/manager
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === req.user.id);
      const isCreator = task.createdBy.toString() === req.user.id;
      
      if (!isAssigned && !isCreator) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
      }
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    req.body.organization = req.user.organization;
    req.body.createdBy = req.user.id;

    const task = await Task.create(req.body);

    await logActivity({
      action: 'CREATED_TASK',
      user: req.user.id,
      organization: req.user.organization,
      targetType: 'Task',
      targetId: task._id,
      details: `Created task: ${task.title}`,
      ipAddress: req.ip
    });

    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('taskCreated', task);

    // Send notifications to assigned users
    if (task.assignedTo && task.assignedTo.length > 0) {
      const usersToNotify = task.assignedTo.map(id => id.toString()).filter(id => id !== req.user.id);
      if (usersToNotify.length > 0) {
        await sendNotificationToMultiple(
          io,
          usersToNotify,
          req.user.organization,
          'New Task Assigned',
          `${req.user.name || 'Someone'} assigned you to a new task: ${task.title}`,
          'info'
        );
      }
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // RBAC: Check ownership or admin/manager status
    if (task.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized for this organization' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && task.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await logActivity({
        action: 'UPDATED_TASK',
        user: req.user.id,
        organization: req.user.organization,
        targetType: 'Task',
        targetId: task._id,
        details: `Updated task: ${task.title}`,
        ipAddress: req.ip
    });

    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('taskUpdated', task);

    // Send notifications to assigned users
    if (task.assignedTo && task.assignedTo.length > 0) {
      const usersToNotify = task.assignedTo.map(id => id.toString()).filter(id => id !== req.user.id);
      if (usersToNotify.length > 0) {
        await sendNotificationToMultiple(
          io,
          usersToNotify,
          req.user.organization,
          'Task Updated',
          `A task you are assigned to was updated: ${task.title}`,
          'info'
        );
      }
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // RBAC check
    if (task.organization.toString() !== req.user.organization.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized for this organization' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && task.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    await logActivity({
        action: 'DELETED_TASK',
        user: req.user.id,
        organization: req.user.organization,
        targetType: 'Task',
        targetId: task._id,
        details: `Deleted task: ${task.title}`,
        ipAddress: req.ip
    });

    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('taskDeleted', task._id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
