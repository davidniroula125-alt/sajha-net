const User = require('../models/User');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const parseUserAgent = (ua) => {
  if (!ua) return { device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS' };
  let browser = 'Unknown Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  let device = os;
  if (ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android')) device = 'Mobile (' + os + ')';
  else device = 'Desktop (' + os + ')';

  return { device, browser, os };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
    await Session.create({
      user: user._id,
      tokenHash: hashToken(token),
      device, browser, os,
      ip: req.ip || req.connection?.remoteAddress || '',
    });

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id);

    const { device, browser, os } = parseUserAgent(req.headers['user-agent']);
    await Session.create({
      user: user._id,
      tokenHash: hashToken(token),
      device, browser, os,
      ip: req.ip || req.connection?.remoteAddress || '',
    });

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      await Session.findOneAndUpdate({ tokenHash: hashToken(token), user: req.user._id }, { isActive: false });
    }
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, address }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
