const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    municipality: { type: String, required: true },
    ward: { type: String, required: true },
    street: String,
    landmark: String
  },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  preferredDate: { type: Date },
  notes: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['esewa', 'khalti', 'bank', 'cash', 'online', ''], default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'installation-scheduled', 'installed', 'rejected'],
    default: 'pending'
  },
  installationDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
