const router = require('express').Router();
const cms = require('../controllers/cmsController');
const { adminAuth } = require('../middleware/auth');

// Hero
router.get('/hero', cms.getHero);
router.put('/hero', adminAuth, cms.updateHero);

// Banners
router.get('/banners', cms.getBanners);
router.post('/banners', adminAuth, cms.createBanner);
router.put('/banners/:id', adminAuth, cms.updateBanner);
router.delete('/banners/:id', adminAuth, cms.deleteBanner);

// Employees
router.get('/employees', cms.getEmployees);
router.post('/employees', adminAuth, cms.createEmployee);
router.put('/employees/:id', adminAuth, cms.updateEmployee);
router.delete('/employees/:id', adminAuth, cms.deleteEmployee);

// Announcements
router.get('/announcements', cms.getAnnouncements);
router.post('/announcements', adminAuth, cms.createAnnouncement);
router.put('/announcements/:id', adminAuth, cms.updateAnnouncement);
router.delete('/announcements/:id', adminAuth, cms.deleteAnnouncement);

// Audit Logs
router.get('/audit-logs', adminAuth, cms.getAuditLogs);
router.post('/audit-logs', adminAuth, cms.createAuditLog);

// Team Members
router.get('/team', cms.getTeamMembers);
router.post('/team', adminAuth, cms.createTeamMember);
router.put('/team/:id', adminAuth, cms.updateTeamMember);
router.delete('/team/:id', adminAuth, cms.deleteTeamMember);

// Gallery
router.get('/gallery', cms.getGallery);
router.post('/gallery', adminAuth, cms.createGalleryItem);
router.delete('/gallery/:id', adminAuth, cms.deleteGalleryItem);

// Notices
router.get('/notices', cms.getNotices);
router.post('/notices', adminAuth, cms.createNotice);
router.put('/notices/:id', adminAuth, cms.updateNotice);
router.delete('/notices/:id', adminAuth, cms.deleteNotice);

module.exports = router;
