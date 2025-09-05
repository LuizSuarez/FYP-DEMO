const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const crypto = require('crypto');
const mongoose = require('mongoose');
const Consent = require("../models/Consent");

// Sign/create consent
router.post("/sign", auth, allowRoles("User"), async (req, res) => {
  try {
    console.log('=== CONSENT SIGN REQUEST ===');
    console.log('Request user:', JSON.stringify(req.user, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    // Validate user ID
    if (!req.user || !req.user.id) {
      console.error('❌ No user ID found in token');
      return res.status(401).json({ message: 'User authentication failed' });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      console.error('❌ Invalid user ID format:', req.user.id);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    console.log('✅ User ID is valid ObjectId:', req.user.id);

    console.log(`🔍 Checking for existing consent for userId: ${req.user.id}`);
    
    // Check if consent already exists for this user
    const existingConsent = await Consent.findOne({ userId: req.user.id });
    if (existingConsent) {
      console.log('✅ User already has consent:', existingConsent._id);
      return res.json({
        message: "Consent already exists",
        consentId: existingConsent.consentId,
        _id: existingConsent._id,
        consent: existingConsent
      });
    }

    console.log('🆕 Creating new consent...');
    
    // Generate UUID with fallback method
    let generatedUUID;
    try {
      generatedUUID = crypto.randomUUID();
      console.log('🆔 Generated UUID (crypto):', generatedUUID);
    } catch (err) {
      // Fallback for older Node.js versions
      generatedUUID = 'consent-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
      console.log('🆔 Generated UUID (fallback):', generatedUUID);
    }
    
    const consentData = {
      consentId: generatedUUID,
      userId: req.user.id,
      signed: true,
      signedAt: new Date(),
    };
    console.log('Consent data to save:', JSON.stringify(consentData, null, 2));
    
    const consent = new Consent(consentData);
    console.log('Consent model created - consentId:', consent.consentId);
    console.log('Consent model created - userId:', consent.userId);
    console.log('Consent model validation errors:', consent.validateSync()?.errors || 'None');
    
    await consent.save();
    console.log('✅ Consent saved successfully with _id:', consent._id);
    
    res.json({
      message: "Consent signed successfully",
      consentId: consent.consentId,
      _id: consent._id,
      consent
    });
  } catch (err) {
    console.error('❌ Consent error details:', {
      message: err.message,
      name: err.name,
      code: err.code,
      stack: err.stack,
      user: req.user,
      errors: err.errors
    });
    
    // Handle specific Mongoose errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      console.error('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Validation error'
      });
    }
    
    if (err.code === 11000) {
      console.error('❌ Duplicate key error:', err.keyValue);
      return res.status(409).json({ 
        message: 'Consent already exists for this user',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Duplicate consent'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create consent', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;
