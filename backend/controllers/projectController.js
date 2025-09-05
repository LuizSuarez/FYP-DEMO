const Project = require('../models/Project');
const mongoose = require('mongoose');

// Create project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      ownerId: userId
    });

    return res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('createProject error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all my projects
exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ ownerId: userId }).sort({ createdAt: -1 });
    return res.json({ projects });
  } catch (err) {
    console.error('getMyProjects error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.ownerId.equals(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({ project });
  } catch (err) {
    console.error('getProjectById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update project (owner only)
exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.ownerId.equals(userId)) {
      return res.status(403).json({ message: 'Only owner can update project' });
    }

    const { name, description } = req.body;
    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();
    return res.json({ message: 'Project updated', project });
  } catch (err) {
    console.error('updateProject error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete project (owner only)
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.ownerId.equals(userId)) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    await project.deleteOne();
    return res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('deleteProject error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
