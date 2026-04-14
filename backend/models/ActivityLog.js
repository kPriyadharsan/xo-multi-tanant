const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true
  },
  targetType: {
    type: String,
    enum: ['Task', 'User', 'Organization'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  details: String,
  ipAddress: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ActivityLogSchema.index({ organization: 1, user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
