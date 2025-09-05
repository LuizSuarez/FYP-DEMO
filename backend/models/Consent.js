// models/Consent.js
const mongoose = require('mongoose');

const ConsentSchema = new mongoose.Schema({
  consentId: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signed: { type: Boolean, default: false },
  signedAt: { type: Date },
  documentVersion: { type: String, default: 'v1.0' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Debug pre-save middleware
ConsentSchema.pre('save', function(next) {
  console.log('🔍 Pre-save middleware - consent data:');
  console.log('  consentId:', this.consentId);
  console.log('  userId:', this.userId);
  console.log('  signed:', this.signed);
  console.log('  signedAt:', this.signedAt);
  
  console.log('✅ Pre-save hook completed (no validation)');
  next();
});

module.exports = mongoose.model('Consent', ConsentSchema);
