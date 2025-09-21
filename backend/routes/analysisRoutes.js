// routes/analysisRoutes.js
const express = require('express');
const router = express.Router();

const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// ✅ Run 6.3 sequence analysis on an uploaded file (by fileId UUID)
router.post(
  '/sequence/:fileId',
  auth,
  allowRoles('User'),
  analysisController.runSequenceAnalysis
);

// ✅ List my analyses (with pagination + optional filter by type)
router.get(
  '/my',
  auth,
  allowRoles('User'),
  analysisController.listMyAnalyses
);

// ✅ Get one analysis (owner only)
router.get(
  '/:analysisId',
  auth,
  allowRoles('User'),
  analysisController.getAnalysis
);

// Get only GC% values for current user (all analyses)
router.get(
  '/gc-content/all',
  auth,
  allowRoles('User'),
  analysisController.getGCContentForUser
);

// Get codon frequencies for one analysis
router.get(
  '/:analysisId/codon-frequencies',
  auth,
  allowRoles('User'),
  analysisController.getCodonFrequencies
);

// Get metrics + summary for one analysis
router.get(
  '/:analysisId/metrics',
  auth,
  allowRoles('User'),
  analysisController.getAnalysisMetrics
);

module.exports = router;
