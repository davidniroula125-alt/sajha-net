const Coverage = require('../models/Coverage');

exports.getCoverages = async (req, res) => {
  try {
    const { province, district } = req.query;
    let query = { isActive: true };
    if (province) query.province = province;
    if (district) query.district = district;
    const coverages = await Coverage.find(query).sort('province district municipality');
    res.json({ success: true, coverages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkCoverage = async (req, res) => {
  try {
    const { province, district, municipality, ward } = req.body;
    const coverage = await Coverage.findOne({ province, district, municipality, ward, isActive: true });
    if (coverage) {
      res.json({ success: true, available: true, coverage });
    } else {
      const partial = await Coverage.findOne({ province, district, municipality, isActive: true });
      if (partial) {
        res.json({ success: true, available: true, coverage: partial, message: 'Coverage available in your area' });
      } else {
        res.json({ success: true, available: false, message: 'Coverage not available in your area yet' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoverage = async (req, res) => {
  try {
    const coverage = await Coverage.create(req.body);
    res.status(201).json({ success: true, coverage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCoverage = async (req, res) => {
  try {
    const coverage = await Coverage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coverage) return res.status(404).json({ success: false, message: 'Coverage not found' });
    res.json({ success: true, coverage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCoverage = async (req, res) => {
  try {
    await Coverage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coverage deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
