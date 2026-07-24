const router = require('express').Router();
const { getApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getApplications);
router.post('/', createApplication);
router.put('/:id', adminAuth, updateApplication);
router.delete('/:id', adminAuth, deleteApplication);

module.exports = router;
