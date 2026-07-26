const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const crypto = require('crypto');

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    const session = await Session.findOne({ tokenHash: hashToken(token), user: user._id, isActive: true });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired or revoked' });
    }

    session.lastActive = new Date();
    await session.save();

    req.user = user;
    req.token = token;
    req.session = session;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};

const ownerAuth = async (req, res, next) => {
  try {
    await adminAuth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Owner access required' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};

module.exports = { auth, adminAuth, ownerAuth };
