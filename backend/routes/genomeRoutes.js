const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const genomeController = require('../controllers/genomeController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// ✅ Upload genome file
router.post(
  '/upload',
  auth,
  allowRoles('User'),
  upload.single('genomeFile'),
  genomeController.uploadGenomeFile
);

// ✅ Get user files
router.get(
  '/my-files',
  auth,
  allowRoles('User'),
  genomeController.getMyFiles
);

// ✅ Download genome file (UUID only)
router.get(
  '/download/:id',
  auth,
  allowRoles('User'),
  genomeController.downloadMyFile
);

// ✅ Delete a genome file (UUID only)
router.delete(
  '/:fileId',
  auth,
  allowRoles('User'),
  genomeController.deleteMyFile
);

// ✅ Assign a file to a project
router.patch(
  '/:fileId/assign-project',
  auth,
  allowRoles('User'),
  genomeController.assignFileToProject
);

// ✅ Unassign a file from its project
router.delete(
  '/:fileId/unassign-project',
  auth,
  allowRoles('User'),
  genomeController.unassignFileFromProject
);

module.exports = router;
