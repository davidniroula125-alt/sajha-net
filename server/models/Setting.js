const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  category: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
