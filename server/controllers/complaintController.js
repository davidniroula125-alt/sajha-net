const Complaint = require('../models/Complaint');
const AuditLog = require('../models/AuditLog');
const crypto = require('crypto');

const logAudit = async (user, action, details, module, req) => {
  try {
    await AuditLog.create({
      user, action, details, module,
      ipAddress: req?.ip || '',
      browser: req?.headers?.['user-agent'] || ''
    });
  } catch {}
};

exports.createComplaint = async (req, res) => {
  try {
    const ticketId = 'CMP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const complaint = await Complaint.create({
      user: req.user?._id,
      ticketId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      category: req.body.category,
      description: req.body.description,
      connectionId: req.body.connectionId,
      address: req.body.address
    });
    await logAudit(req.user?._id, 'Complaint Filed', `${req.body.category}: ${req.body.subject} by ${req.body.name}`, 'complaint', req);
    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    const complaints = await Complaint.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Complaint.countDocuments(query);
    res.json({ success: true, complaints, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.adminReply) updateData.adminReply = req.body.adminReply;
    if (req.body.priority) updateData.priority = req.body.priority;
    if (req.body.status === 'resolved') updateData.resolvedAt = new Date();
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (req.body.status) {
      await logAudit(req.user?._id, `Complaint ${req.body.status.replace('_', ' ')}`, `Complaint "${complaint.subject}" status changed to ${req.body.status}`, 'complaint', req);
    }
    if (req.body.adminReply) {
      await logAudit(req.user?._id, 'Complaint Replied', `Admin replied to complaint "${complaint.subject}"`, 'complaint', req);
    }
    if (req.body.priority) {
      await logAudit(req.user?._id, 'Complaint Priority Changed', `Complaint "${complaint.subject}" priority set to ${req.body.priority}`, 'complaint', req);
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    await Complaint.findByIdAndDelete(req.params.id);
    await logAudit(req.user?._id, 'Complaint Deleted', `Deleted complaint "${complaint?.subject || 'Unknown'}"`, 'complaint', req);
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
