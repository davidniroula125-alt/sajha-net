const router = require('express').Router();
const { getTickets, getUserTickets, createTicket, updateTicket, addMessage, deleteTicket } = require('../controllers/ticketController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getTickets);
router.get('/user', auth, getUserTickets);
router.post('/', auth, createTicket);
router.put('/:id', adminAuth, updateTicket);
router.post('/:id/message', auth, addMessage);
router.delete('/:id', adminAuth, deleteTicket);

module.exports = router;
