const mongoose = require('mongoose');

const coverageSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  municipality: { type: String, required: true },
  ward: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  estimatedSpeed: { type: String, default: '' },
  servicesAvailable: [{ type: String }],
  estimatedInstallationDays: { type: Number, default: 7 }
}, { timestamps: true });

module.exports = mongoose.model('Coverage', coverageSchema);
