const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    res.json({ success: true, setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMultiple = async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
