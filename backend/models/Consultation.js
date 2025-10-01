const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema(
  {
    consultationId: { type: String, required: true, unique: true },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    consultationType: {
      type: String,
      enum: ["report-share", "physical-appointment"],
      required: true,
    },
    scheduledAt: { type: Date },
    notes: { type: String, default: "" },
    sharedReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnalysisResult",
    },
    status: {
      type: String,
      enum: ["Requested", "Confirmed", "Completed", "Cancelled"],
      default: "Requested",
    },
    annotationIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Annotation" },
    ],
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", ConsultationSchema);
