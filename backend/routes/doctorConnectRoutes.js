const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require('../middleware/role');
const doctorConnectController = require("../controllers/doctorConnectController");

// 📌 User shares report with clinician
router.post("/share", auth, allowRoles("User"), doctorConnectController.shareReportWithClinician);

// 📌 User books physical appointment
router.post("/appointments", auth, allowRoles("User"), doctorConnectController.bookPhysicalAppointment);

// 📌 List consultations (user or clinician)
router.get("/consultations", auth, doctorConnectController.listMyConsultations);

// 📌 Clinician adds annotation
router.post("/consultations/:consultationId/annotations", auth, allowRoles("Clinician"), doctorConnectController.addAnnotation);

// 📌 Admin verifies doctor
router.patch("/clinician/:doctorId/verify", auth, allowRoles("Admin"), doctorConnectController.verifyDoctor);

module.exports = router;
