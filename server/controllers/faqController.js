const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    const faqs = await FAQ.find(query).sort('sortOrder');
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
