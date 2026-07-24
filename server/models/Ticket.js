const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ticketId: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['technical', 'billing', 'installation', 'general', 'complaint'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'waiting', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolution: String,
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
