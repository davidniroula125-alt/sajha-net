const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true, enum: ['news', 'tips', 'technology', 'offers', 'fiber-guide', 'general'] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featuredImage: { type: String, default: '' },
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
