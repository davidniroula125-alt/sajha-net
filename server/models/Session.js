const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  device: { type: String, default: 'Unknown Device' },
  browser: { type: String, default: 'Unknown Browser' },
  os: { type: String, default: 'Unknown OS' },
  ip: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

sessionSchema.index({ user: 1 });
sessionSchema.index({ tokenHash: 1 });
sessionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Session', sessionSchema);
