const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// Project CRUD (Users only)
router.post('/', auth, allowRoles('User'), projectController.createProject);
router.get('/', auth, allowRoles('User'), projectController.getMyProjects);
router.get('/:id', auth, allowRoles('User'), projectController.getProjectById);
router.put('/:id', auth, allowRoles('User'), projectController.updateProject);
router.delete('/:id', auth, allowRoles('User'), projectController.deleteProject);

module.exports = router;
