const router = require('express').Router();
const { createFeedback, getFeedbacks, getUserFeedbacks, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createFeedback);
router.get('/user', auth, getUserFeedbacks);
router.get('/', adminAuth, getFeedbacks);
router.put('/:id', adminAuth, updateFeedback);
router.delete('/:id', adminAuth, deleteFeedback);

module.exports = router;
