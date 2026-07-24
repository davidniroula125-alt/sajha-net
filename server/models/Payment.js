const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['esewa', 'khalti', 'bank', 'cash', 'online'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  duration: { type: String, enum: ['monthly', 'quarterly', 'halfYearly', 'yearly'] },
  invoiceNumber: { type: String, required: true },
  description: { type: String, default: '' },
  paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
