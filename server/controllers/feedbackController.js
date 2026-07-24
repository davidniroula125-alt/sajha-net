const Feedback = require('../models/Feedback');
const AuditLog = require('../models/AuditLog');

const logAudit = async (user, action, details, module, req) => {
  try {
    await AuditLog.create({
      user, action, details, module,
      ipAddress: req?.ip || '',
      browser: req?.headers?.['user-agent'] || ''
    });
  } catch {}
};

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user: req.user?._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
      subject: req.body.subject,
      rating: req.body.rating,
      message: req.body.message
    });
    await logAudit(req.user?._id, 'Feedback Submitted', `${req.body.type}: ${req.body.subject} by ${req.body.name}`, 'feedback', req);
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    const feedbacks = await Feedback.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Feedback.countDocuments(query);
    res.json({ success: true, feedbacks, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.adminReply) updateData.adminReply = req.body.adminReply;
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (req.body.status === 'read') {
      await logAudit(req.user?._id, 'Feedback Read', `Feedback "${feedback.subject}" marked as read`, 'feedback', req);
    }
    if (req.body.adminReply) {
      await logAudit(req.user?._id, 'Feedback Replied', `Admin replied to feedback "${feedback.subject}"`, 'feedback', req);
    }
    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    await Feedback.findByIdAndDelete(req.params.id);
    await logAudit(req.user?._id, 'Feedback Deleted', `Deleted feedback "${feedback?.subject || 'Unknown'}"`, 'feedback', req);
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
