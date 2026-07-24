const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  department: { type: String, default: 'General' },
  role: { type: String, enum: ['admin', 'editor', 'support', 'sales', 'technician'], default: 'support' },
  avatar: { type: String, default: '' },
  position: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
