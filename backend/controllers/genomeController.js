// controllers/genomeController.js
const crypto = require('crypto');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const GenomeFile = require('../models/GenomeFile');
const Project = require('../models/Project');
const Consent = require('../models/Consent');
const AnalysisResult = require('../models/AnalysisResult');
const DeletionLog = require('../models/DeletionLog');
const { encryptPerFileKey, decryptPerFileKey, sha256HexOfBuffer } = require('../utils/encryption');
const { inferType, looksLikeFASTA, looksLikeVCF, looksLikeGFF } = require('../utils/genomeValidators');

function getBucket() {
  if (!mongoose.connection.db) throw new Error('MongoDB not connected');
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'genomeFiles' });
}

function encryptBufferGCM(buffer, perFileKey) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', perFileKey, iv);
  const ct = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext: ct, iv, authTag: tag };
}

// ✅ Upload genome file
exports.uploadGenomeFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const userIdStr = req.user && (req.user.id || req.user._id);
    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userObjId = new mongoose.Types.ObjectId(userIdStr);

    const { consentId, projectId } = req.body;
    if (!consentId) return res.status(400).json({ message: 'consentId is required' });

    // Check if consent exists and is signed by the user
    let consentObjectId = null;
    if (mongoose.Types.ObjectId.isValid(consentId)) {
      // If it's a valid ObjectId, use it directly
      consentObjectId = new mongoose.Types.ObjectId(consentId);
    } else {
      // If it's a string, find consent by consentId field
      const consent = await Consent.findOne({ consentId, userId: userObjId });
      if (!consent || !consent.signed) {
        return res.status(403).json({ message: 'Valid signed consent not found.' });
      }
      consentObjectId = consent._id;
    }

    const buf = req.file.buffer;
    const fileType = inferType(req.file.originalname);
    if (fileType === 'fasta' && !looksLikeFASTA(buf)) return res.status(400).json({ message: 'Invalid FASTA structure' });
    if (fileType === 'vcf' && !looksLikeVCF(buf)) return res.status(400).json({ message: 'Invalid VCF structure' });
    if (fileType === 'gff' && !looksLikeGFF(buf)) return res.status(400).json({ message: 'Invalid GFF structure' });
    if (fileType === 'unknown') return res.status(400).json({ message: 'Unsupported file type' });

    const perFileKey = crypto.randomBytes(32);
    const { ciphertext, iv, authTag } = encryptBufferGCM(buf, perFileKey);
    const encryptedHashHex = sha256HexOfBuffer(ciphertext);

    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        uploaderId: userObjId,
        origin: 'user',
        projectId: projectId || null,
        consentId: consentId,
        fileType,
        fileHash: encryptedHashHex
      }
    });

    await new Promise((resolve, reject) => {
      uploadStream.end(ciphertext, (err) => (err ? reject(err) : resolve()));
    });

    const gridFsId = uploadStream.id;
    const encryptedKeyHex = encryptPerFileKey(perFileKey);

    const doc = await GenomeFile.create({
      fileId: crypto.randomUUID(), // ✅ UUID only
      uploaderId: userObjId,
      ownerUserId: userObjId,
      filename: req.file.originalname,
      origin: 'user',
      projectId: projectId || null,
      consentId: consentObjectId, // Use the validated ObjectId
      gridFsId,
      size: ciphertext.length,
      hash: encryptedHashHex,
      encryptedKey: encryptedKeyHex,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      uploadDate: new Date()
    });

    return res.status(201).json({
      message: 'File uploaded securely.',
      fileId: doc.fileId, // ✅ return UUID only
      filename: doc.filename,
      uploadDate: doc.uploadDate
    });
  } catch (err) {
    console.error('uploadGenomeFile error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};




// ✅ Get my files (with pagination, search, filtering, wrapped response)
exports.getMyFiles = async (req, res) => {
  try {
    const userIdStr = req.user && (req.user.id || req.user._id);
    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userObjId = new mongoose.Types.ObjectId(userIdStr);

    // 📌 Pagination defaults
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // 📌 Build filter object
    const filter = { ownerUserId: userObjId };

    // 🔎 Search by filename
    if (req.query.search) {
      filter.filename = { $regex: req.query.search, $options: 'i' };
    }

    // 🎯 Filter by fileType (FASTA / VCF / GFF)
    if (req.query.type) {
      filter.fileType = req.query.type.toLowerCase();
    }

    // 📅 Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.uploadDate = {};
      if (req.query.startDate) {
        filter.uploadDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.uploadDate.$lte = new Date(req.query.endDate);
      }
    }

    // ✅ Fetch files
    const [docs, total] = await Promise.all([
      GenomeFile.find(filter)
        .select('-encryptedKey -__v -gridFsId -authTag -iv -_id')
        .sort({ uploadDate: -1 }) // newest first
        .skip(skip)
        .limit(limit),
      GenomeFile.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        files: docs
      }
    });
  } catch (err) {
    console.error('getMyFiles error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error: err.message
    });
  }
};


// ✅ Download genome file (by UUID)
exports.downloadMyFile = async (req, res) => {
  try {
    const userIdStr = req.user && (req.user.id || req.user._id);
    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userObjId = new mongoose.Types.ObjectId(userIdStr);

    const { id: fileId } = req.params; // UUID
    const doc = await GenomeFile.findOne({ fileId });
    if (!doc) return res.status(404).json({ message: 'File not found' });

    if (!doc.ownerUserId.equals(userObjId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const perFileKeyBuf = decryptPerFileKey(doc.encryptedKey);
    const iv = Buffer.from(doc.iv, 'hex');
    const authTag = Buffer.from(doc.authTag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', perFileKeyBuf, iv);
    decipher.setAuthTag(authTag);

    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStream(doc.gridFsId);

    res.setHeader('Content-Disposition', `attachment; filename="${doc.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    downloadStream.pipe(decipher).pipe(res).on('error', (err) => {
      console.error('Stream/decrypt error:', err);
      res.status(500).end('Failed to download file.');
    });
  } catch (err) {
    console.error('downloadMyFile error:', err);
    return res.status(500).json({ message: 'Download failed', error: err.message });
  }
};



exports.deleteMyFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userIdStr = req.user && (req.user.id || req.user._id);

    if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userObjId = new mongoose.Types.ObjectId(userIdStr);

    // Find the file by UUID and owner
    const file = await GenomeFile.findOne({ fileId, ownerUserId: userObjId });
    if (!file) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    // Delete from GridFS
    const bucket = getBucket();
    await bucket.delete(file.gridFsId);

    // Delete linked AnalysisResults
    await AnalysisResult.deleteMany({ genomeFileId: file._id });

    // Delete GenomeFile metadata
    await file.deleteOne();

    // Create deletion log for compliance
    await DeletionLog.create({
      userId: userObjId,
      fileId: file.fileId,
      deletedAt: new Date(),
    });

    return res.status(200).json({
      message: 'File and associated data deleted successfully',
    });
  } catch (error) {
    console.error('deleteMyFile error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};



// ✅ Assign
exports.assignFileToProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;
    const { projectId } = req.body;

    const file = await GenomeFile.findOne({ fileId, ownerUserId: userId });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const project = await Project.findById(projectId);
    if (!project || !project.ownerId.equals(userId)) {
      return res.status(403).json({ message: 'Not allowed to assign to this project' });
    }

    file.projectId = projectId;
    await file.save();

    return res.json({ message: 'File assigned to project', file });
  } catch (err) {
    console.error('assignFileToProject error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Unassign
exports.unassignFileFromProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;

    const file = await GenomeFile.findOne({ fileId, ownerUserId: userId });
    if (!file) return res.status(404).json({ message: 'File not found' });

    file.projectId = null;
    await file.save();

    return res.json({ message: 'File removed from project', file });
  } catch (err) {
    console.error('unassignFileFromProject error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
