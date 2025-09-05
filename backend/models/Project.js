
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String , default: ""},
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
