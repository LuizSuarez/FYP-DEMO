// models/DeletionLog.js
const mongoose = require('mongoose');

const deletionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: String, // UUID of genome file
    required: true
  },
  deletedAt: {
    type: Date,
    default: Date.now, // timestamp of deletion
    // TTL index will use this field to auto-delete
  }
});

// ✅ TTL index: automatically delete logs after 5 years (5 * 365 * 24 * 60 * 60 seconds)
deletionLogSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 5 * 365 * 24 * 60 * 60 });

module.exports = mongoose.model('DeletionLog', deletionLogSchema);
