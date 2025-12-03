const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Land', 'Farm', 'House'], required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  size: String, // e.g., "500 sqm" or "2 Acres"
  description: String,
  images: [String], // Array of image URLs
  status: { type: String, default: 'Available' }, // Available, Sold
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);