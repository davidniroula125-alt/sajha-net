const router = require('express').Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;
