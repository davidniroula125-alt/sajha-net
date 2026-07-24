const router = require('express').Router();
const { createComplaint, getComplaints, getUserComplaints, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createComplaint);
router.get('/user', auth, getUserComplaints);
router.get('/', adminAuth, getComplaints);
router.put('/:id', adminAuth, updateComplaint);
router.delete('/:id', adminAuth, deleteComplaint);

module.exports = router;
