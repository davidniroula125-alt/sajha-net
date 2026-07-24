const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  category: { type: String, enum: ['slow_speed', 'no_internet', 'frequent_disconnect', 'billing', 'installation', 'router_issue', 'other'], default: 'other' },
  description: { type: String, required: true },
  connectionId: { type: String, default: '' },
  address: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved', 'closed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  adminReply: { type: String, default: '' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
