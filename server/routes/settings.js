const router = require('express').Router();
const { getSettings, updateSetting, updateMultiple } = require('../controllers/settingController');
const { adminAuth } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', adminAuth, updateSetting);
router.put('/bulk', adminAuth, updateMultiple);

module.exports = router;
