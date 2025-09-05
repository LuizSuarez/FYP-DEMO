// models/GenomeFile.js
const mongoose = require('mongoose');

const GenomeFileSchema = new mongoose.Schema({
  fileId: { type: String, unique: true, required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  origin: { type: String, enum: ['user'], default: 'user' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  tags: [String],
  consentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consent', required: true },
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true },
  size: { type: Number },
  hash: { type: String },
  encryptedKey: { type: String },
  iv: { type: String },
  authTag: { type: String },
  uploadDate: { type: Date, default: Date.now },


}, { timestamps: true });

module.exports = mongoose.model('GenomeFile', GenomeFileSchema);
