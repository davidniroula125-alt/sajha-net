const router = require('express').Router();
const { getServices, getServiceBySlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', adminAuth, createService);
router.put('/:id', adminAuth, updateService);
router.delete('/:id', adminAuth, deleteService);

module.exports = router;
