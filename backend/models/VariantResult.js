const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  chrom: { type: String, required: true },
  pos: { type: Number, required: true },
  id: { type: String },
  ref: { type: String, required: true },
  alt: { type: String, required: true },
  type: { type: String, enum: ["SNP", "Insertion", "Deletion", "Complex"], required: true },
  genotype: { type: String, enum: ["homozygous", "heterozygous", "unknown"], default: "unknown" },
  effect: { type: String },  // e.g. missense_variant, synonymous_variant
  impact: { type: String },  // e.g. HIGH, MODERATE, LOW
});

const VariantAnalysisSchema = new mongoose.Schema(
  {
    genomeFileId: { type: mongoose.Schema.Types.ObjectId, ref: "GenomeFile", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Running", "Completed", "Failed"], default: "Running" },
    error: { type: String, default: null },

    summary: {
      total_variants: { type: Number, default: 0 },
      snp: { type: Number, default: 0 },
      insertions: { type: Number, default: 0 },
      deletions: { type: Number, default: 0 },
      homozygous: { type: Number, default: 0 },
      heterozygous: { type: Number, default: 0 },
      note: { type: String }, // e.g. "No ANN/CSQ fields found…"
    },

    variants: [VariantSchema], // ✅ store all parsed variants here
    variants_preview: [VariantSchema], // ✅ quick access for frontend preview
  },
  { timestamps: true }
);

module.exports = mongoose.model("VariantAnalysis", VariantAnalysisSchema);
