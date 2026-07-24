const router = require('express').Router();
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { adminAuth } = require('../middleware/auth');

router.get('/', getFAQs);
router.post('/', adminAuth, createFAQ);
router.put('/:id', adminAuth, updateFAQ);
router.delete('/:id', adminAuth, deleteFAQ);

module.exports = router;
