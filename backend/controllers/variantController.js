const axios = require("axios");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { decryptPerFileKey } = require("../utils/encryption");
const AnalysisResult = require("../models/AnalysisResult");
const VariantResult = require("../models/VariantResult");

// Helper: safely remove temp files
function safeUnlink(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, err => {
    if (err && err.code !== "ENOENT") {
      console.warn(`⚠️ Failed to delete temp file ${filePath}: ${err.message}`);
    }
  });
}

// Download from GridFS and save decrypted temp file
async function writeDecryptedToTemp(genomeDoc) {
  const perFileKey = decryptPerFileKey(genomeDoc.encryptedKey);
  const iv = Buffer.from(genomeDoc.iv, "hex");
  const authTag = Buffer.from(genomeDoc.authTag, "hex");
  const decipher = require("crypto").createDecipheriv("aes-256-gcm", perFileKey, iv);
  decipher.setAuthTag(authTag);

  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "genomeFiles" });
  const downloadStream = bucket.openDownloadStream(genomeDoc.gridFsId);

  const ext = path.extname(genomeDoc.filename);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "genome-"));
  const tmpFile = path.join(tmpDir, `decrypted-${Date.now()}${ext}`);

  await new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(tmpFile);
    downloadStream.pipe(decipher).pipe(ws);
    ws.on("finish", resolve);
    ws.on("error", reject);
    downloadStream.on("error", reject);
  });

  return { tmpDir, tmpFile };
}

exports.detectVariants = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);

    const GenomeFile = mongoose.model("GenomeFile");
    const genomeDoc = await GenomeFile.findOne({fileId});
    if (!genomeDoc) return res.status(404).json({ message: "Genome file not found" });
    if (!genomeDoc.ownerUserId.equals(userId)) return res.status(403).json({ message: "Access denied" });

    // Create initial analysis record
    const analysisDoc = await VariantResult.create({
      genomeFileId: genomeDoc._id,
      userId,
      analysisType: "VariantDetection",
      status: "Running",
    });

    const { tmpDir, tmpFile } = await writeDecryptedToTemp(genomeDoc);

    try {
      console.log("Sending tmpFile to Flask:", tmpFile);
      // Call Flask backend
      const response = await axios.post("http://localhost:8000/variant-detect", {
        filepath: tmpFile
      });

      const data = response.data;

      // Update analysis document
      analysisDoc.status = "Completed";
      analysisDoc.results = data.summary;
      analysisDoc.variants_preview = data.variants_preview;
      analysisDoc.variants = data.variants;
      await analysisDoc.save();

      safeUnlink(tmpFile);
      fs.rmdir(tmpDir, { recursive: true}, () => {});

      return res.json({
        message: "Variant analysis completed",
        analysis: analysisDoc,
      });

    } catch (err) {
      safeUnlink(tmpFile);
      fs.rmdir(tmpDir, { recursive: true }, () => {});

      analysisDoc.status = "Failed";
      analysisDoc.error = err.message;
      await analysisDoc.save();
      return res.status(500).json({ message: "Analysis failed", analysis: analysisDoc });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===============================================
// ✅ Mutation Density (per chromosome)
// ===============================================
exports.getMutationDensity = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);

    const doc = await AnalysisResult.findOne({
      analysisType: "VariantDetection",
      userId,
    }).sort({ createdAt: -1 });

    if (!doc) return res.status(404).json({ message: "No variant analysis found" });

    const variants = doc.results?.variants_preview || [];
    if (!variants.length) return res.json({ densities: [] });

    const densities = {};
    for (const v of variants) {
      densities[v.chrom] = (densities[v.chrom] || 0) + 1;
    }

    return res.json({
      fileId,
      totalVariants: variants.length,
      densities: Object.entries(densities).map(([chrom, count]) => ({ chrom, count })),
    });
  } catch (err) {
    console.error("getMutationDensity error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===============================================
// ✅ Region Metrics (SNP/Indel/Homo/Hetero counts)
// ===============================================
exports.getRegionMetrics = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);

    const doc = await AnalysisResult.findOne({
      analysisType: "VariantDetection",
      userId,
    }).sort({ createdAt: -1 });

    if (!doc) return res.status(404).json({ message: "No variant analysis found" });

    const variants = doc.results?.variants_preview || [];
    if (!variants.length) return res.json({ metrics: {} });

    const metrics = {
      snps: variants.filter(v => v.type === "SNP").length,
      insertions: variants.filter(v => v.type === "Insertion").length,
      deletions: variants.filter(v => v.type === "Deletion").length,
      homozygous: variants.filter(v => v.genotype === "homozygous").length,
      heterozygous: variants.filter(v => v.genotype === "heterozygous").length,
    };

    return res.json({ fileId, metrics });
  } catch (err) {
    console.error("getRegionMetrics error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
