const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true },
  messages: [{
    sender: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['active', 'closed', 'transferred'], default: 'active' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  satisfaction: { type: Number, min: 1, max: 5 },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
