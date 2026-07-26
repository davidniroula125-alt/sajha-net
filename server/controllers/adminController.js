const User = require('../models/User');
const Application = require('../models/Application');
const Ticket = require('../models/Ticket');
const Package = require('../models/Package');
const Blog = require('../models/Blog');
const ChatMessage = require('../models/ChatMessage');
const Session = require('../models/Session');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const installedApplications = await Application.countDocuments({ status: 'installed' });
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const totalPackages = await Package.countDocuments({ isActive: true });
    const totalBlogs = await Blog.countDocuments();
    const totalChats = await ChatMessage.countDocuments();

    const recentApplications = await Application.find().populate('package', 'name speed').sort('-createdAt').limit(5);
    const recentTickets = await Ticket.find().populate('user', 'name email').sort('-createdAt').limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        pendingApplications,
        installedApplications,
        totalTickets,
        openTickets,
        totalPackages,
        totalBlogs,
        totalChats
      },
      recentApplications,
      recentTickets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    let query = {};
    if (role) query.role = role;
    const users = await User.find(query).select('-password').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments(query);

    const Payment = require('../models/Payment');
    const enriched = await Promise.all(users.map(async (u) => {
      const app = await Application.findOne({ user: u._id }).sort({ createdAt: -1 }).populate('package', 'name speed');
      const payment = await Payment.findOne({ user: u._id, status: 'completed' }).sort({ paidAt: -1 }).populate('package', 'name speed');
      return {
        ...u.toObject(),
        packageName: app?.package?.name || payment?.package?.name || null,
        packageSpeed: app?.package?.speed || payment?.package?.speed || null,
        paymentStatus: app?.paymentStatus || 'unpaid',
        paymentMethod: app?.paymentMethod || payment?.method || '',
        paymentDuration: app?.paymentDuration || payment?.duration || '',
        expiryDate: app?.expiryDate || null,
      };
    }));

    res.json({ success: true, users: enriched, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserSubscription = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, paymentDuration, expiryDate } = req.body;
    const app = await Application.findOne({ user: req.params.id }).sort({ createdAt: -1 });
    if (!app) return res.status(404).json({ success: false, message: 'No application found for this customer' });

    if (paymentStatus) app.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) app.paymentMethod = paymentMethod;
    if (paymentDuration) app.paymentDuration = paymentDuration;
    if (expiryDate !== undefined) app.expiryDate = expiryDate ? new Date(expiryDate) : null;

    await app.save();
    res.json({ success: true, application: app });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true })
      .populate('user', 'name email phone role')
      .sort('-lastActive');
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeSession = async (req, res) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Session revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeAllUserSessions = async (req, res) => {
  try {
    await Session.updateMany({ user: req.params.userId, isActive: true }, { isActive: false });
    res.json({ success: true, message: 'All sessions revoked for this user' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true })
      .populate('user', 'name email role')
      .sort('-lastActive');
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeAllUserSessions = async (req, res) => {
  try {
    await Session.updateMany({ user: req.params.id, isActive: true }, { isActive: false });
    res.json({ success: true, message: 'All sessions revoked for this user' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
