const router = require('express').Router();
const { getDashboardStats, getAllUsers, updateUser, deleteUser, updateUserSubscription, getActiveSessions, revokeSession, revokeAllUserSessions } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id', adminAuth, updateUser);
router.put('/users/:id/subscription', adminAuth, updateUserSubscription);
router.delete('/users/:id', adminAuth, deleteUser);

router.get('/sessions', adminAuth, getActiveSessions);
router.put('/sessions/:id/revoke', adminAuth, revokeSession);
router.put('/users/:id/revoke-sessions', adminAuth, revokeAllUserSessions);

module.exports = router;
