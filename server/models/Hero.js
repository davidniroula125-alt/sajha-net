const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: { type: String, default: 'नेपालको सबैभन्दा भरपर्दो हाई-स्पीड इन्टरनेट' },
  subtitle: { type: String, default: 'Ultra Fast Fiber Internet | Reliable Connection | 24/7 Customer Support' },
  backgroundImage: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  ctaButtons: [{
    text: String,
    url: String,
    primary: { type: Boolean, default: false }
  }],
  badge: { type: String, default: 'Nepal\'s Fastest Growing ISP' },
  stats: [{
    label: String,
    value: String,
    icon: String
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
