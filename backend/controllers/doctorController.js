// controllers/doctorController.js
const Doctor = require('../models/Doctor');


// Clinician: update their own profile
exports.updateSelfDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userRef: req.user.id },
      req.body,
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile updated', doctor });
  } catch (err) {
    console.error('updateSelfDoctorProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get list of doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ rating: -1 });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single doctor
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
