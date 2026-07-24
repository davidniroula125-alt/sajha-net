const router = require('express').Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', adminAuth, createPackage);
router.put('/:id', adminAuth, updatePackage);
router.delete('/:id', adminAuth, deletePackage);

module.exports = router;
