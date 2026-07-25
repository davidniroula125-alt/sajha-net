const router = require('express').Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser, updateUserSubscription } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id', adminAuth, updateUser);
router.put('/users/:id/subscription', adminAuth, updateUserSubscription);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;
