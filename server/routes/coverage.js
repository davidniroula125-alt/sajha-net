const router = require('express').Router();
const { getCoverages, checkCoverage, createCoverage, updateCoverage, deleteCoverage } = require('../controllers/coverageController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getCoverages);
router.post('/check', checkCoverage);
router.post('/', adminAuth, createCoverage);
router.put('/:id', adminAuth, updateCoverage);
router.delete('/:id', adminAuth, deleteCoverage);

module.exports = router;
