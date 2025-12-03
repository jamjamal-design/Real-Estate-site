const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: String,
  description: { type: String, required: true },
  completionDate: Date,
  gallery: [String]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
