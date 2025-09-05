const DeletionLog = require('../models/DeletionLog');
const { Parser } = require('json2csv');

// Get all deletion logs with optional filters
exports.getAllDeletionLogs = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (fromDate || toDate) query.deletedAt = {};
    if (fromDate) query.deletedAt.$gte = new Date(fromDate);
    if (toDate) query.deletedAt.$lte = new Date(toDate);

    const logs = await DeletionLog.find(query).sort({ deletedAt: -1 }).populate('userId', 'name email');

    res.json(logs);
  } catch (err) {
    console.error('getAllDeletionLogs error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Export deletion logs as CSV
exports.exportDeletionLogsCSV = async (req, res) => {
  try {
    const logs = await DeletionLog.find().sort({ deletedAt: -1 }).populate('userId', 'name email');

    const fields = ['userId.name', 'userId.email', 'fileId', 'deletedAt', 'reason'];
    const parser = new Parser({ fields });
    const csv = parser.parse(logs);

    res.header('Content-Type', 'text/csv');
    res.attachment('deletion_logs.csv');
    res.send(csv);
  } catch (err) {
    console.error('exportDeletionLogsCSV error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
