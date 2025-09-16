

// controllers/analysisController.js
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const GenomeFile = require('../models/GenomeFile');
const AnalysisResult = require('../models/AnalysisResult');
const { decryptPerFileKey } = require('../utils/encryption');

function getBucket() {
  if (!mongoose.connection.db) throw new Error('MongoDB not connected');
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'genomeFiles' });
}

async function writeDecryptedToTemp(genomeDoc) {
  return new Promise((resolve, reject) => {
    try {
      const perFileKey = decryptPerFileKey(genomeDoc.encryptedKey);
      const iv = Buffer.from(genomeDoc.iv, 'hex');
      const authTag = Buffer.from(genomeDoc.authTag, 'hex');

      const decipher = require('crypto').createDecipheriv('aes-256-gcm', perFileKey, iv);
      decipher.setAuthTag(authTag);

      const bucket = getBucket();
      const rs = bucket.openDownloadStream(genomeDoc.gridFsId);

      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'seq-'));
      const tmpFile = path.join(tmpDir, `${genomeDoc.filename || 'input'}.fa`);
      const ws = fs.createWriteStream(tmpFile);

      rs.on('error', (err) => reject(err));
      ws.on('error', (err) => reject(err));
      ws.on('finish', () => resolve({ tmpDir, tmpFile }));

      rs.pipe(decipher).pipe(ws);
    } catch (e) {
      reject(e);
    }
  });
}

// ✅ POST /analysis/sequence/:fileId
exports.runSequenceAnalysis = async (req, res) => {
  try {
    const userIdStr = req.user && (req.user._id || req.user.id);
    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = new mongoose.Types.ObjectId(userIdStr);

    const { fileId } = req.params; // always UUID
    const genomeDoc = await GenomeFile.findOne({ fileId });
    if (!genomeDoc) return res.status(404).json({ message: 'Genome file not found' });
    if (!genomeDoc.ownerUserId.equals(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const analysis = await AnalysisResult.create({
      genomeFileId: genomeDoc._id,
      userId,
      analysisType: 'GenomeSequence',
      status: 'Running',
      results: {},
    });

    const { tmpDir, tmpFile } = await writeDecryptedToTemp(genomeDoc);

    const py = spawn('C:\\Python313\\python.exe', [
      path.join(__dirname, '..', 'genome', 'analyzer.py'),
      '--input', tmpFile
    ], { env: process.env });

    let out = '';
    let errBuf = '';

    py.stdout.on('data', (d) => (out += d.toString()));
    py.stderr.on('data', (d) => (errBuf += d.toString()));

    py.on('close', async (code) => {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

      if (code !== 0) {
        analysis.status = 'Failed';
        analysis.error = errBuf || `Python exited with code ${code}`;
        await analysis.save();
        return res.status(500).json({ message: 'Analysis failed', analysis });
      }

      let parsed;
      try {
        parsed = JSON.parse(out);
      } catch (e) {
        console.error("Analyzer output parse failed:", out);
        analysis.status = 'Failed';
        analysis.error = 'Invalid analyzer output';
        await analysis.save();
        return res.status(500).json({ message: 'Analysis failed (bad output)', analysis });
      }

      analysis.status = 'Completed';
      analysis.results = parsed;
      await analysis.save();

      return res.json({ message: 'Analysis complete', analysis });
    });
  } catch (err) {
    console.error('runSequenceAnalysis error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ GET /analysis/my?type=GenomeSequence&page=1&limit=10 (paginated)
exports.listMyAnalyses = async (req, res) => {
  try {
    console.log("DEBUG listMyAnalyses req.user:", req.user);
    console.log("DEBUG listMyAnalyses req.query:", req.query);
    const userIdStr = req.user && (req.user._id || req.user.id);
    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = new mongoose.Types.ObjectId(userIdStr);

    const { type, page = 1, limit = 10 } = req.query;
    const q = { userId };
    if (type) q.analysisType = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [docs, total] = await Promise.all([
      AnalysisResult.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      AnalysisResult.countDocuments(q)
    ]);

    return res.json({
      analyses: docs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('listMyAnalyses error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /analysis/:analysisId (owner only)
exports.getAnalysis = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);
    const { analysisId } = req.params;

    const doc = await AnalysisResult.findById(analysisId);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (!doc.userId.equals(userId)) return res.status(403).json({ message: 'Access denied' });

    return res.json({ analysis: doc });
  } catch (err) {
    console.error('getAnalysis error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /analysis/gc-content (all GC% for current user)
exports.getGCContentForUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);
    const docs = await AnalysisResult.find(
      { userId, "results.metrics.gc_percent": { $exists: true } },
      { "results.metrics.gc_percent": 1, createdAt: 1 }
    ).sort({ createdAt: -1 });

    return res.json({ gcContents: docs });
  } catch (err) {
    console.error("getGCContentForUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /analysis/:analysisId/codon-frequencies
exports.getCodonFrequencies = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);
    const { analysisId } = req.params;

    const doc = await AnalysisResult.findById(
      analysisId,
      { "results.codon.frequencies": 1, userId: 1 }
    );
    if (!doc) return res.status(404).json({ message: "Analysis not found" });
    if (!doc.userId.equals(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.json({ codonFrequencies: doc.results.codon.frequencies });
  } catch (err) {
    console.error("getCodonFrequencies error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /analysis/:analysisId/metrics
exports.getAnalysisMetrics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);
    const { analysisId } = req.params;

    const doc = await AnalysisResult.findById(
      analysisId,
      { "results.metrics": 1, "results.summary": 1, userId: 1 }
    );
    if (!doc) return res.status(404).json({ message: "Analysis not found" });
    if (!doc.userId.equals(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.json({ metrics: doc.results.metrics, summary: doc.results.summary });
  } catch (err) {
    console.error("getAnalysisMetrics error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

