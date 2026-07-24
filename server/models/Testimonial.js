const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  avatar: { type: String, default: '' },
  package: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
