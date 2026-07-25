const Application = require('../models/Application');
const User = require('../models/User');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');

exports.getApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    const applications = await Application.find(query)
      .populate('package', 'name speed price prices')
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Application.countDocuments(query);
    res.json({ success: true, applications, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('package');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const { status, paymentStatus, paymentMethod, adminNotes } = req.body;

    if (paymentStatus) application.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) application.paymentMethod = paymentMethod;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;

    if (status === 'approved' && application.paymentStatus === 'paid') {
      let user = await User.findOne({ phone: application.phone });
      if (!user) {
        const tempPassword = await bcrypt.hash('sajha123', 10);
        user = await User.create({
          name: application.fullName,
          email: application.email,
          phone: application.phone,
          password: tempPassword,
          role: 'customer',
          address: {
            province: application.address.province,
            district: application.address.district,
            municipality: application.address.municipality,
            ward: application.address.ward,
            street: application.address.street || '',
            landmark: application.address.landmark || '',
          },
        });
      }

      application.user = user._id;
      application.status = 'installed';
      application.installationDate = new Date();

      const pkg = application.package;
      const duration = pkg?.billingCycle || 'yearly';
      const amount = pkg?.prices?.yearly || pkg?.price || 0;
      const invoiceNum = 'INV-' + Date.now();

      await Payment.create({
        user: user._id,
        amount,
        method: application.paymentMethod || 'cash',
        status: 'completed',
        package: pkg?._id,
        duration,
        invoiceNumber: invoiceNum,
        description: 'Application payment - ' + (pkg?.name || 'Package'),
        paidAt: new Date(),
      });
    } else if (status) {
      application.status = status;
      if (status === 'installed') {
        application.installationDate = new Date();
      }
    }

    await application.save();
    const updated = await Application.findById(application._id)
      .populate('package', 'name speed price prices')
      .populate('user', 'name email phone');
    res.json({ success: true, application: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
