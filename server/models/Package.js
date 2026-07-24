const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  speed: { type: Number, required: true },
  speedUnit: { type: String, default: 'Mbps' },
  type: { type: String, enum: ['internet', 'combo', 'business', 'enterprise'], default: 'internet' },
  billingCycle: { type: String, enum: ['monthly', 'quarterly', 'halfYearly', 'yearly'], default: 'yearly' },
  price: { type: Number, required: true },
  installationCharge: { type: Number, default: 0 },
  image: { type: String, default: '' },
  badge: { type: String, default: '' },
  features: [{ type: String }],
  includes: {
    router: { type: Boolean, default: false },
    mesh: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    ott: [{ type: String }],
    unlimitedData: { type: Boolean, default: true },
    dropWire: { type: Boolean, default: false },
    fairUsagePolicy: { type: String, default: '' }
  },
  idealFor: [{ type: String }],
  highlights: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [String]
  }
}, { timestamps: true });

packageSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Package', packageSchema);
