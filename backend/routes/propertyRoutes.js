const express = require('express');
const router = express.Router();
const Property = require('../models/property/Property');
const { isAdmin } = require('../middleware/auth');

// GET /api/properties - Fetch all properties for the user page
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// GET /api/properties/:id - Fetch single property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
});

// POST /api/properties - (Admin only) Add a new property
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, type, price, location, size, description, images, status } = req.body;
    
    // Validate required fields
    if (!title || !type || !price || !location) {
      return res.status(400).json({ message: 'Missing required fields: title, type, price, location' });
    }

    const newProperty = new Property({
      title,
      type,
      price,
      location,
      size,
      description,
      images,
      status
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
});

// DELETE /api/properties/:id - (Admin only) Remove a property
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProperty = await Property.findByIdAndDelete(id);
    
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully', property: deletedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

// PUT /api/properties/:id - (Admin only) Update a property
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, price, location, size, description, images, status } = req.body;
    
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { title, type, price, location, size, description, images, status },
      { new: true, runValidators: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

module.exports = router;
