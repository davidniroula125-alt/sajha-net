const Application = require('../models/Application');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Package = require('../models/Package');

exports.getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const todayApplications = await Application.countDocuments({ createdAt: { $gte: today } });
    const monthlyApplications = await Application.countDocuments({ createdAt: { $gte: thisMonth } });
    const lastMonthApplications = await Application.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } });

    const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
    const monthlyUsers = await User.countDocuments({ createdAt: { $gte: thisMonth } });

    const popularPackages = await Package.find({ isActive: true }).sort('-sortOrder').limit(5);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyData = await Application.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        todayApplications,
        monthlyApplications,
        lastMonthApplications,
        todayUsers,
        monthlyUsers,
        popularPackages,
        applicationsByStatus,
        monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
