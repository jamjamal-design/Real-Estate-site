const express = require('express');
const router = express.Router();
const Project = require('../models/project/Project');
const { isAdmin } = require('../middleware/auth');

// GET /api/projects - Fetch all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ completionDate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// GET /api/projects/:id - Fetch single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// POST /api/projects - (Admin only) Add a new project
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, clientName, description, completionDate, gallery } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields: title, description' });
    }

    const newProject = new Project({
      title,
      clientName,
      description,
      completionDate: completionDate || new Date(),
      gallery
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// PUT /api/projects/:id - (Admin only) Update a project
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, clientName, description, completionDate, gallery } = req.body;
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, clientName, description, completionDate, gallery },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// DELETE /api/projects/:id - (Admin only) Remove a project
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;
