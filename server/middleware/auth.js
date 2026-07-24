const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    req.user = user;
    req.token = token;
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
