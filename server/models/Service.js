const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  icon: { type: String, default: '' },
  features: [{ type: String }],
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  category: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
