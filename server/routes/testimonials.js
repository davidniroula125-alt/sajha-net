const router = require('express').Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { adminAuth } = require('../middleware/auth');

router.get('/', getTestimonials);
router.post('/', adminAuth, createTestimonial);
router.put('/:id', adminAuth, updateTestimonial);
router.delete('/:id', adminAuth, deleteTestimonial);

module.exports = router;
