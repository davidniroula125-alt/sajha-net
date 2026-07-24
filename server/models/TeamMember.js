const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
