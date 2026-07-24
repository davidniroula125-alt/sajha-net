const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  type: { type: String, enum: ['feedback', 'suggestion', 'praise', 'complaint'], default: 'feedback' },
  subject: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
  adminReply: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
