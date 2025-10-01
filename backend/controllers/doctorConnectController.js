const crypto = require("crypto");
const Consultation = require("../models/Consultation");
const Doctor = require("../models/Doctor");
const Annotation = require("../models/Annotation");
const AnalysisResult = require("../models/AnalysisResult");

// 1️⃣ Share report with clinician
exports.shareReportWithClinician = async (req, res) => {
  try {
    const { doctorId, sharedReportId, message } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.verified)
      return res.status(404).json({ message: "Doctor not found or not verified" });

    const report = await AnalysisResult.findById(sharedReportId);
    if (!report)
      return res.status(404).json({ message: "Report not found" });

    const consultation = await Consultation.create({
      consultationId: "share-" + crypto.randomBytes(8).toString("hex"),
      patientId: req.user.id,
      doctorId,
      consultationType: "report-share",
      notes: message || "User shared analysis summary",
      sharedReportId: report._id,
      status: "Requested",
    });

    res.status(201).json({ message: "Report shared successfully", consultation });
  } catch (err) {
    console.error("shareReportWithClinician error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Book physical appointment
exports.bookPhysicalAppointment = async (req, res) => {
  try {
    const { doctorId, scheduledAt, reason, patientContact } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.verified)
      return res.status(404).json({ message: "Doctor not found or not verified" });

    const conflict = await Consultation.findOne({
      doctorId,
      scheduledAt: new Date(scheduledAt),
      status: { $in: ["Confirmed", "Requested"] },
    });

    if (conflict)
      return res.status(409).json({ message: "Time slot not available" });

    const appointment = await Consultation.create({
      consultationId: "appt-" + crypto.randomBytes(8).toString("hex"),
      patientId: req.user.id,
      doctorId,
      consultationType: "physical-appointment",
      notes: reason || "",
      scheduledAt: new Date(scheduledAt),
      status: "Confirmed",
      metadata: { patientContact },
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("bookPhysicalAppointment error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ List consultations (for user/doctor)
exports.listMyConsultations = async (req, res) => {
  try {
    const q = {};
    if (req.user.role === "User") q.patientId = req.user.id;
    else if (req.user.role === "Clinician") {
      const doctor = await Doctor.findOne({ userRef: req.user.id });
      if (!doctor)
        return res.status(403).json({ message: "Clinician profile not linked" });
      q.doctorId = doctor._id;
    }

    const consultations = await Consultation.find(q)
      .populate("doctorId", "name specialty hospital")
      .populate("sharedReportId", "analysisType results status");

    res.json({ consultations });
  } catch (err) {
    console.error("listMyConsultations error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4️⃣ Add annotation (clinician only)
exports.addAnnotation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { text } = req.body;

    const doctor = await Doctor.findOne({ userRef: req.user.id });
    if (!doctor)
      return res.status(403).json({ message: "Clinician profile not linked" });

    const consultation = await Consultation.findOne({ consultationId });
    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    const annotation = await Annotation.create({
      consultationId: consultation._id,
      analysisResultId: consultation.sharedReportId,
      doctorId: doctor._id,
      patientId: consultation.patientId,
      text,
    });

    consultation.annotationIds.push(annotation._id);
    await consultation.save();

    res.status(201).json({ message: "Annotation saved", annotation });
  } catch (err) {
    console.error("addAnnotation error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 5️⃣ Admin verify doctor
exports.verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    doctor.verified = true;
    await doctor.save();

    res.json({ message: "Doctor verified successfully", doctor });
  } catch (err) {
    console.error("verifyDoctor error", err);
    res.status(500).json({ message: "Server error" });
  }
};
