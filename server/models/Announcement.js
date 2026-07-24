const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'maintenance', 'offer', 'urgent'], default: 'info' },
  isActive: { type: Boolean, default: true },
  isPopup: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  link: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
