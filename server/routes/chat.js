const router = require('express').Router();
const { getChats, getUserChats, sendMessage, adminReply, closeChat, deleteChat } = require('../controllers/chatController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getChats);
router.get('/user', auth, getUserChats);
router.post('/send', sendMessage);
router.post('/admin-reply', adminAuth, adminReply);
router.put('/close/:id', adminAuth, closeChat);
router.delete('/:id', adminAuth, deleteChat);

module.exports = router;
