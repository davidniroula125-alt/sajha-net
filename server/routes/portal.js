const router = require('express').Router();
const Payment = require('../models/Payment');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');

router.get('/subscription', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ user: req.user._id, status: 'completed' })
      .sort({ paidAt: -1 })
      .populate('package', 'name speed price prices billingCycle');

    const application = await Application.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('package', 'name speed price prices billingCycle');

    let expiryDate = null;
    let paymentStatus = 'unpaid';
    let currentPackage = null;
    let paymentMethod = '';
    let paidAt = null;
    let duration = '';

    if (payment) {
      currentPackage = payment.package;
      paidAt = payment.paidAt;
      duration = payment.duration;
      paymentMethod = payment.method;
      paymentStatus = 'paid';

      if (application?.expiryDate) {
        expiryDate = application.expiryDate;
      } else if (paidAt && duration) {
        const months = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };
        const m = months[duration] || 12;
        expiryDate = new Date(paidAt);
        expiryDate.setMonth(expiryDate.getMonth() + m);
      }
    } else if (application) {
      currentPackage = application.package;
      paymentStatus = application.paymentStatus || 'unpaid';
      expiryDate = application.expiryDate;
    }

    const isExpired = expiryDate ? new Date() > new Date(expiryDate) : true;
    const daysRemaining = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    const payments = await Payment.find({ user: req.user._id })
      .sort({ paidAt: -1 })
      .limit(10)
      .populate('package', 'name speed');

    res.json({
      success: true,
      subscription: {
        package: currentPackage ? { name: currentPackage.name, speed: currentPackage.speed, price: currentPackage.prices || {} } : null,
        paymentStatus,
        paymentMethod,
        expiryDate,
        paidAt,
        duration,
        isExpired,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      },
      payments: payments.map(p => ({
        amount: p.amount,
        method: p.method,
        status: p.status,
        date: p.paidAt,
        invoice: p.invoiceNumber,
        package: p.package?.name || 'N/A',
        duration: p.duration,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
