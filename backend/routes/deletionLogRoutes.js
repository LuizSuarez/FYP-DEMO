// routes/deletionLogRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const deletionLogController = require('../controllers/deletionLogController');

// Admin: Get all deletion logs with optional filters
router.get(
  '/',
  auth,
  allowRoles('Admin'),
  deletionLogController.getAllDeletionLogs
);

// Admin: Export deletion logs as CSV
router.get(
  '/export',
  auth,
  allowRoles('Admin'),
  deletionLogController.exportDeletionLogsCSV
);

module.exports = router;
