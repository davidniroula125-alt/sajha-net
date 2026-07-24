const Hero = require('../models/Hero');
const Banner = require('../models/Banner');
const Employee = require('../models/Employee');
const Announcement = require('../models/Announcement');
const AuditLog = require('../models/AuditLog');
const Media = require('../models/Media');
const TeamMember = require('../models/TeamMember');
const Gallery = require('../models/Gallery');
const Notice = require('../models/Notice');
const Setting = require('../models/Setting');

const logAudit = async (user, action, details, module, req) => {
  try {
    await AuditLog.create({
      user, action, details, module,
      ipAddress: req?.ip || '',
      browser: req?.headers?.['user-agent'] || ''
    });
  } catch {}
};

// Hero
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true });
    res.json({ success: true, hero: hero || {} });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, hero });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Banners
exports.getBanners = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;
    const banners = await Banner.find(query).sort('sortOrder');
    res.json({ success: true, banners });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort('-createdAt');
    res.json({ success: true, employees });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, employee });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, employee });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort('-createdAt');
    res.json({ success: true, announcements });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, announcement });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, announcement });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, module, search, dateFrom, dateTo } = req.query;
    let query = {};
    if (module) query.module = module;
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
    }
    const logs = await AuditLog.find(query).populate('user', 'name email').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await AuditLog.countDocuments(query);
    res.json({ success: true, logs, total, pages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createAuditLog = async (req, res) => {
  try {
    await logAudit(req.user?._id, req.body.action, req.body.details, req.body.module, req);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Team Members
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort('sortOrder');
    res.json({ success: true, members });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, member });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, member });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Gallery
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort('sortOrder');
    res.json({ success: true, items });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// Notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort('-publishedAt');
    res.json({ success: true, notices });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, notice });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, notice });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
