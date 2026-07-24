const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  type: { type: String, enum: ['hero', 'offer', 'promo', 'popup', 'slider'], default: 'slider' },
  position: { type: String, default: 'homepage' },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
