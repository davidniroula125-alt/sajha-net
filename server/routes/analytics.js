const router = require('express').Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getAnalytics);

module.exports = router;
