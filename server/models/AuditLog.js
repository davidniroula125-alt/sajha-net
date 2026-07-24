const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  browser: { type: String, default: '' },
  module: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
