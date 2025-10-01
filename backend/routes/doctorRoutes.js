// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// Public
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctor);

// Clinician:  update own profile

router.put('/self', auth, allowRoles('Clinician'), doctorController.updateSelfDoctorProfile);



module.exports = router;
