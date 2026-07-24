const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'general', enum: ['general', 'technical', 'billing', 'installation', 'packages', 'support'] },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
