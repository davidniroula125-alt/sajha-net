const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  speed: { type: Number, required: true },
  speedUnit: { type: String, default: 'Mbps' },
  type: { type: String, enum: ['internet', 'combo', 'business', 'enterprise'], default: 'internet' },
  price: {
    monthly: { type: Number, required: true },
    quarterly: { type: Number },
    halfYearly: { type: Number },
    yearly: { type: Number }
  },
  installationCharge: { type: Number, default: 0 },
  features: [{ type: String }],
  includes: {
    router: { type: Boolean, default: false },
    mesh: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    ott: [{ type: String }],
    unlimitedData: { type: Boolean, default: true },
    fairUsagePolicy: { type: String, default: '' }
  },
  idealFor: [{ type: String }],
  highlights: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
