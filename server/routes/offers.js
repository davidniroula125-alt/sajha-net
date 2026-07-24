const router = require('express').Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { adminAuth } = require('../middleware/auth');

router.get('/', getOffers);
router.post('/', adminAuth, createOffer);
router.put('/:id', adminAuth, updateOffer);
router.delete('/:id', adminAuth, deleteOffer);

module.exports = router;
