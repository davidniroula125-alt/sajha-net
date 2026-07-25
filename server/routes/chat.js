const router = require('express').Router();
const User = require('../models/User');
const Payment = require('../models/Payment');
const Package = require('../models/Package');
const { getChats, getUserChats, sendMessage, adminReply, closeChat, deleteChat } = require('../controllers/chatController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', adminAuth, getChats);
router.get('/user', auth, getUserChats);
router.post('/send', sendMessage);
router.post('/admin-reply', adminAuth, adminReply);
router.put('/close/:id', adminAuth, closeChat);
router.delete('/:id', adminAuth, deleteChat);

router.post('/lookup', async (req, res) => {
  try {
    const { phone, lastName } = req.body;
    if (!phone || !lastName) {
      return res.status(400).json({ success: false, message: 'Phone and last name are required' });
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this phone number' });
    }

    const nameParts = user.name.trim().split(/\s+/);
    const userLastName = nameParts[nameParts.length - 1].toLowerCase();
    if (userLastName !== lastName.trim().toLowerCase()) {
      return res.status(404).json({ success: false, message: 'Last name does not match our records' });
    }

    const latestPayment = await Payment.findOne({ user: user._id, status: 'completed' })
      .sort({ paidAt: -1 })
      .populate('package', 'name slug speed price prices');

    let expiryDate = null;
    let packageName = null;
    let packageSpeed = null;

    if (latestPayment && latestPayment.paidAt) {
      const paidAt = new Date(latestPayment.paidAt);
      const duration = latestPayment.duration || 'yearly';
      const durationMonths = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };
      const months = durationMonths[duration] || 12;
      expiryDate = new Date(paidAt);
      expiryDate.setMonth(expiryDate.getMonth() + months);

      if (latestPayment.package) {
        packageName = latestPayment.package.name;
        packageSpeed = latestPayment.package.speed;
      }
    }

    const packages = await Package.find({ isActive: true, type: { $in: ['internet', 'combo'] } })
      .select('name slug speed price prices type')
      .sort({ sortOrder: 1 });

    res.json({
      success: true,
      name: user.name,
      phone: user.phone,
      expiryDate: expiryDate ? expiryDate.toISOString() : null,
      isExpired: expiryDate ? new Date() > expiryDate : true,
      currentPackage: packageName,
      currentSpeed: packageSpeed,
      packages: packages.map(p => ({
        name: p.name,
        speed: p.speed,
        price: p.prices,
        type: p.type
      }))
    });
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
