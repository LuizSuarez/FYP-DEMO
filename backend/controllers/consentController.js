// controllers/consentController.js
const mongoose = require('mongoose');
const Consent = require("../models/Consent");
const crypto = require('crypto');

exports.signConsent = async (req, res) => {
  try {
    const userId = req.user.id;

    const consent = new Consent({
      consentId: crypto.randomUUID(), // Generate unique consent ID
      userId: req.user.id,
      signed: true,
      signedAt: new Date(),
    });


    await consent.save();

    res.json({
      message: "Consent signed successfully",
      consentId: consent._id,   // 👈 return the ID
      consent,                  // optional: return full doc
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
