const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, default: "General" },
    hospital: { type: String, default: "" },
    licenseNumber: { type: String, required: true },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    consultations: { type: Number, default: 0 },
    nextAvailable: { type: Date, default: null },
    location: { type: String, default: "" },
    languages: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
