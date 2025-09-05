// models/AnalysisResult.js
const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema(
  {
    genomeFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GenomeFile',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // ties each analysis result to a module type
    analysisType: {
      type: String,
      enum: [
        'GenomeSequence',   // 6.3
        'VariantDetection', // 6.4
        'Visualization',    // 6.5
        'RiskPrediction',   // 6.6
        'Comparison',       // 6.7
        'Report',           // 6.8
        'Annotation',       // 6.9
        'ExternalDB',       // 6.10
        'Other',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Running', 'Completed', 'Failed'],
      default: 'Pending',
      index: true,
    },
    // Flexible JSON payload
    results: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    error: {
      type: String,
      default: null,
    },
    // Optional reference to any artifacts (e.g., PDF/CSV later)
    artifacts: {
      type: [{
        kind: { type: String },   // e.g., 'csv', 'pdf'
        path: { type: String },   // or GridFS id if you store artifacts there
      }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AnalysisResult', AnalysisResultSchema);
