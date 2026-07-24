const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  code: { type: String, unique: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  maxUses: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  terms: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
