const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const applicationRoutes = require('./routes/applications');
const blogRoutes = require('./routes/blogs');
const chatRoutes = require('./routes/chat');
const supportRoutes = require('./routes/support');
const coverageRoutes = require('./routes/coverage');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const serviceRoutes = require('./routes/services');
const testimonialRoutes = require('./routes/testimonials');
const faqRoutes = require('./routes/faqs');
const offerRoutes = require('./routes/offers');
const portalRoutes = require('./routes/portal');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sajhanet', {
  serverSelectionTimeoutMS: 15000,
  heartbeatFrequencyMS: 30000,
  tls: true,
  tlsAllowInvalidCertificates: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err.message));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
  });

  socket.on('send-message', (data) => {
    io.to('admin-room').emit('new-message', data);
    io.to(`user-${data.userId}`).emit('message-received', data);
  });

  socket.on('typing', (data) => {
    io.to('admin-room').emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/coverage', coverageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', require('./routes/settings'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/feedbacks', require('./routes/feedbacks'));
app.use('/api/speed-test', require('./routes/speedTest'));
app.use('/api/portal', portalRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auto-migration: convert old-format price objects to Number + backfill prices on startup
(async () => {
  try {
    const Package = require('./models/Package');
    const oldPkgs = await Package.find({ price: { $type: 'object' } }).select('_id price');
    if (oldPkgs.length > 0) {
      for (const pkg of oldPkgs) {
        const yearlyPrice = pkg.price?.yearly || pkg.price?.monthly || 0;
        await Package.updateOne({ _id: pkg._id }, { $set: {
          price: yearlyPrice,
          billingCycle: 'yearly',
          prices: {
            yearly: yearlyPrice,
            halfYearly: Math.round(yearlyPrice / 2),
            quarterly: Math.round(yearlyPrice / 4),
            monthly: Math.round(yearlyPrice / 12)
          }
        } });
      }
      console.log(`Migrated ${oldPkgs.length} old-format package(s) to new price format.`);
    }

    // Backfill prices for ALL packages missing proper prices object
    const knownPrices = {
      'bronze': { yearly: 6500, halfYearly: 3250, quarterly: 1625, monthly: 542 },
      'silver': { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 },
      'gold': { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 },
      'platinum': { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 },
      'essential': { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 },
      'enhanced': { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 },
      'premium': { yearly: 10500, halfYearly: 5250, quarterly: 2625, monthly: 875 },
      'business starter': { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 },
      'business pro': { yearly: 15000, halfYearly: 7500, quarterly: 3750, monthly: 1250 }
    };
    const allPkgs = await Package.find({});
    let backfilled = 0;
    for (const pkg of allPkgs) {
      const slug = (pkg.slug || pkg.name || '').toLowerCase().trim();
      const needsBackfill = !pkg.prices || !pkg.prices.yearly || pkg.prices.yearly === 0;
      if (needsBackfill) {
        const yearlyPrice = knownPrices[slug]?.yearly || pkg.price || 0;
        const prices = knownPrices[slug] || {
          yearly: yearlyPrice,
          halfYearly: Math.round(yearlyPrice / 2),
          quarterly: Math.round(yearlyPrice / 4),
          monthly: Math.round(yearlyPrice / 12)
        };
        await Package.updateOne({ _id: pkg._id }, { $set: {
          price: yearlyPrice,
          billingCycle: 'yearly',
          prices
        } });
        backfilled++;
      }
    }
    if (backfilled > 0) {
      console.log(`Backfilled prices for ${backfilled} package(s).`);
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }

  // Auto-seed: populate empty collections with default data
  try {
    const Package = require('./models/Package');
    const Service = require('./models/Service');
    const FAQ = require('./models/FAQ');
    const Testimonial = require('./models/Testimonial');
    const Coverage = require('./models/Coverage');
    const Setting = require('./models/Setting');
    const Hero = require('./models/Hero');
    const Banner = require('./models/Banner');
    const User = require('./models/User');

    const pkgCount = await Package.countDocuments();

    const bcrypt = require('bcryptjs');
    const adminUser = await User.findOne({ email: 'admin@sajhanet.com' });
    if (!adminUser) {
      await User.create({ name: 'Admin', email: 'admin@sajhanet.com', password: 'Sajha@Admin2026', role: 'admin', phone: '+977-9801234567' });
      console.log('Admin account created with new credentials.');
    } else {
      const isOldPassword = await bcrypt.compare('admin123', adminUser.password);
      if (isOldPassword) {
        adminUser.password = 'Sajha@Admin2026';
        await adminUser.save();
        console.log('Admin password updated to new credentials.');
      }
    }

    if (pkgCount === 0) {
      console.log('No packages found. Seeding default data...');

      await Package.insertMany([
        { name: 'Bronze', slug: 'bronze', speed: 80, type: 'internet', billingCycle: 'yearly', price: 6500, prices: { yearly: 6500, halfYearly: 3250, quarterly: 1625, monthly: 542 }, installationCharge: 0, features: ['Unlimited Internet', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Browsing', 'Social Media', 'Light Streaming'], isPopular: false, sortOrder: 1, description: 'Bronze package — 80 Mbps fiber internet.', shortDescription: '80 Mbps Fiber Internet' },
        { name: 'Silver', slug: 'silver', speed: 100, type: 'internet', billingCycle: 'yearly', price: 7500, prices: { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 }, installationCharge: 0, features: ['Unlimited Internet', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Family', 'Streaming', 'HD Video'], isPopular: true, sortOrder: 2, description: 'Silver package — 100 Mbps fiber internet.', shortDescription: '100 Mbps Fiber Internet' },
        { name: 'Gold', slug: 'gold', speed: 150, type: 'internet', billingCycle: 'yearly', price: 8500, prices: { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 }, installationCharge: 0, features: ['Unlimited Internet', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Multiple Devices', 'HD Streaming', 'Gaming'], isRecommended: true, sortOrder: 3, description: 'Gold package — 150 Mbps fiber internet.', shortDescription: '150 Mbps Fiber Internet' },
        { name: 'Platinum', slug: 'platinum', speed: 200, type: 'internet', billingCycle: 'yearly', price: 9500, prices: { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 }, installationCharge: 0, features: ['Unlimited Internet', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Power Users', '4K Streaming', 'Multiple Users'], isRecommended: true, sortOrder: 4, description: 'Platinum package — 200 Mbps fiber internet.', shortDescription: '200 Mbps Fiber Internet' },
        { name: 'Essential', slug: 'essential', speed: 80, type: 'combo', billingCycle: 'yearly', price: 8500, prices: { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 }, installationCharge: 0, features: ['Unlimited Internet', 'IP TV Included', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: true, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Entertainment', 'Family', 'TV + Internet'], sortOrder: 5, description: 'Essential combo — 80 Mbps internet + IP TV.', shortDescription: '80 Mbps + IP TV Bundle' },
        { name: 'Enhanced', slug: 'enhanced', speed: 150, type: 'combo', billingCycle: 'yearly', price: 9500, prices: { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 }, installationCharge: 0, features: ['Unlimited Internet', 'IP TV Included', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: true, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Family Entertainment', 'HD Streaming + TV'], isPopular: true, sortOrder: 6, description: 'Enhanced combo — 150 Mbps internet + IP TV.', shortDescription: '150 Mbps + IP TV Bundle' },
        { name: 'Premium', slug: 'premium', speed: 200, type: 'combo', billingCycle: 'yearly', price: 10500, prices: { yearly: 10500, halfYearly: 5250, quarterly: 2625, monthly: 875 }, installationCharge: 0, features: ['Unlimited Internet', 'IP TV Included', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Support'], includes: { router: true, mesh: false, tv: true, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Ultimate Bundle', 'Power Users', '4K + TV'], isRecommended: true, sortOrder: 7, description: 'Premium combo — 200 Mbps internet + IP TV.', shortDescription: '200 Mbps + IP TV Bundle' },
        { name: 'Business Starter', slug: 'business-starter', speed: 100, type: 'business', billingCycle: 'yearly', price: 7500, prices: { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 }, installationCharge: 0, features: ['100 Mbps Dedicated', 'Fiber Connection', '99.9% Uptime SLA', '24x7 Priority Support', 'Static IP', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: false, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Small Business', 'Startups'], sortOrder: 8, description: 'Business Starter — 100 Mbps dedicated fiber.', shortDescription: '100 Mbps Business Internet' },
        { name: 'Business Pro', slug: 'business-pro', speed: 300, type: 'business', billingCycle: 'yearly', price: 15000, prices: { yearly: 15000, halfYearly: 7500, quarterly: 3750, monthly: 1250 }, installationCharge: 0, features: ['300 Mbps Dedicated', 'Fiber Connection', '99.99% Uptime SLA', '24x7 Priority Support', 'Static IP', 'Managed WiFi', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: true, tv: false, phone: false, unlimitedData: true, dropWire: true }, idealFor: ['Growing Business', 'Offices'], isRecommended: true, sortOrder: 9, description: 'Business Pro — 300 Mbps dedicated fiber.', shortDescription: '300 Mbps Business Internet' }
      ]);

      await Service.insertMany([
        { name: 'Fiber Internet', slug: 'fiber-internet', description: 'High-speed fiber optic internet for homes and businesses.', shortDescription: 'Ultra-fast fiber connectivity', icon: 'FaWifi', features: ['Speeds up to 1 Gbps', '99.9% Uptime', 'Unlimited Data', 'Free Router'], category: 'internet', sortOrder: 1 },
        { name: 'Business Internet', slug: 'business-internet', description: 'Dedicated internet solutions for businesses with SLA guarantees.', shortDescription: 'Enterprise-grade connectivity', icon: 'FaBuilding', features: ['Dedicated Bandwidth', 'Static IP', 'SLA Guarantee', '24/7 Support'], category: 'business', sortOrder: 2 },
        { name: 'NetTV', slug: 'nettv', description: 'IPTV service with 200+ channels including HD and 4K.', shortDescription: 'Premium IPTV service', icon: 'FaTv', features: ['200+ Channels', 'HD & 4K Content', 'Catch-up TV', 'Multi-screen'], category: 'entertainment', sortOrder: 3 },
        { name: 'Mesh WiFi', slug: 'mesh-wifi', description: 'Whole-home WiFi coverage with mesh technology.', shortDescription: 'Seamless home coverage', icon: 'FaHome', features: ['Whole-home Coverage', 'Easy Setup', 'Parental Controls', 'Guest Network'], category: 'addons', sortOrder: 4 },
        { name: 'Cloud Services', slug: 'cloud-services', description: 'Cloud storage and computing solutions.', shortDescription: 'Cloud infrastructure', icon: 'FaCloud', features: ['Cloud Storage', 'Backup Solutions', 'Scalable Resources', 'Data Security'], category: 'enterprise', sortOrder: 5 },
        { name: 'Web Hosting', slug: 'web-hosting', description: 'Reliable web hosting with 99.9% uptime.', shortDescription: 'Fast & reliable hosting', icon: 'FaServer', features: ['99.9% Uptime', 'Free SSL', 'cPanel Access', '24/7 Support'], category: 'services', sortOrder: 6 },
        { name: 'VPN Services', slug: 'vpn-services', description: 'Secure VPN for business and personal use.', shortDescription: 'Secure connectivity', icon: 'FaShieldAlt', features: ['Encrypted Connection', 'Remote Access', 'Multiple Protocols', 'No Logs'], category: 'enterprise', sortOrder: 7 },
        { name: 'CCTV Networking', slug: 'cctv-networking', description: 'Professional CCTV installation and networking.', shortDescription: 'Security solutions', icon: 'FaVideo', features: ['HD Cameras', 'Remote Monitoring', 'Night Vision', 'Cloud Storage'], category: 'services', sortOrder: 8 }
      ]);

      await FAQ.insertMany([
        { question: 'How do I apply for a new connection?', answer: 'You can apply online through our website or visit your nearest Sajha Net office. Fill out the application form and our team will contact you within 24 hours.', category: 'installation', sortOrder: 1 },
        { question: 'What is the installation process?', answer: 'After application approval, our technical team will visit your location for fiber installation. The process typically takes 1-3 days depending on your area.', category: 'installation', sortOrder: 2 },
        { question: 'What speeds are available?', answer: 'We offer speeds from 80 Mbps to 300 Mbps. Choose the plan that best fits your needs. You can upgrade or downgrade anytime.', category: 'packages', sortOrder: 3 },
        { question: 'Is there a data limit?', answer: 'No, all our plans come with unlimited data. We believe in fair and transparent internet access.', category: 'packages', sortOrder: 4 },
        { question: 'How do I pay my bill?', answer: 'You can pay through eSewa, Khalti, bank transfer, or visit our office for cash payment. Online payment is available 24/7.', category: 'billing', sortOrder: 5 },
        { question: 'What should I do if my internet is slow?', answer: 'First, restart your router. If the issue persists, check our troubleshooting guide or contact our support team at 9705390890.', category: 'technical', sortOrder: 6 },
        { question: 'How do I report a complaint?', answer: 'You can submit a complaint through our support page, call us at 9705390890, or use our live chat feature.', category: 'support', sortOrder: 7 },
        { question: 'What is the minimum contract period?', answer: 'We offer both monthly and annual plans. Annual plans come with significant discounts. There is no lock-in period for monthly plans.', category: 'billing', sortOrder: 8 }
      ]);

      await Testimonial.insertMany([
        { name: 'Aarav Sharma', location: 'Itahari', rating: 5, content: 'Best ISP in Nepal! Super fast speeds and excellent customer support.', package: '100 Mbps', isFeatured: true, sortOrder: 1 },
        { name: 'Priya Thapa', location: 'Lalitpur', rating: 5, content: 'Switched from another ISP and the difference is night and day.', package: '200 Mbps', isFeatured: true, sortOrder: 2 },
        { name: 'Bikash Gurung', location: 'Pokhara', rating: 4, content: 'Great service for the price. Installation was quick and professional.', package: '50 Mbps', isFeatured: true, sortOrder: 3 },
        { name: 'Sita Maharjan', location: 'Bhaktapur', rating: 5, content: 'Perfect for streaming and gaming. No more buffering!', package: '300 Mbps', isFeatured: false, sortOrder: 4 },
        { name: 'Rajan Das', location: 'Chitwan', rating: 5, content: 'As a business owner, I need reliable internet. Sajha Net delivers.', package: 'Business 300 Mbps', isFeatured: true, sortOrder: 5 }
      ]);

      await Coverage.insertMany([
        { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '1', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
        { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '5', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
        { province: 'Bagmati', district: 'Lalitpur', municipality: 'Lalitpur Metropolitan', ward: '1', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
        { province: 'Gandaki', district: 'Kaski', municipality: 'Pokhara Metropolitan', ward: '1', estimatedSpeed: 'Up to 500 Mbps', servicesAvailable: ['Fiber', 'TV'] },
        { province: 'Lumbini', district: 'Rupandehi', municipality: 'Bhairahawa', ward: '1', estimatedSpeed: 'Up to 300 Mbps', servicesAvailable: ['Fiber'] }
      ]);

      const heroExists = await Hero.countDocuments();
      if (!heroExists) {
        await Hero.create({
          title: 'Super Fast Fiber Internet & HD TV',
          subtitle: 'No Deposit Required! FREE Router + Drop Wire Included with Every Plan!',
          badge: 'Connect at the speed of life',
          ctaButtons: [
            { text: 'Get Connection Now', url: '/apply', primary: true },
            { text: 'View Packages', url: '/packages', primary: false }
          ],
          stats: [
            { label: 'No Deposit', value: 'Required!', icon: 'shield' },
            { label: 'FREE Router', value: 'Included', icon: 'wifi' },
            { label: '24/7 Support', value: 'Always Available', icon: 'clock' }
          ]
        });
      }

      const bannerCount = await Banner.countDocuments();
      if (bannerCount === 0) {
        await Banner.insertMany([
          { title: 'No Deposit Required!', description: 'Get connected without any deposit. FREE Router + Drop Wire included!', type: 'offer', position: 'homepage', isActive: true, sortOrder: 1 },
          { title: 'Super Fast Fiber Internet & HD TV', description: 'Internet + IP TV combo plans starting at NPR 8,500/year.', type: 'promo', position: 'homepage', isActive: true, sortOrder: 2 }
        ]);
      }

      const settingCount = await Setting.countDocuments();
      if (settingCount === 0) {
        await Setting.insertMany([
          { key: 'companyName', value: 'Sajha Net Pvt. Ltd.', category: 'general' },
          { key: 'contactEmail', value: 'sajhanet2025@gmail.com', category: 'contact' },
          { key: 'contactPhone', value: '9705390890', category: 'contact' },
          { key: 'contactPhone2', value: '9709110186', category: 'contact' },
          { key: 'technicalPhone', value: '970910187', category: 'contact' },
          { key: 'contactAddress', value: 'Itahari, Nepal', category: 'contact' },
          { key: 'facebook', value: 'https://www.facebook.com/sajhanet', category: 'social' },
          { key: 'instagram', value: 'https://instagram.com/sajhanet', category: 'social' },
          { key: 'twitter', value: 'https://twitter.com/sajhanet', category: 'social' },
          { key: 'youtube', value: 'https://youtube.com/sajhanet', category: 'social' },
          { key: 'ctaTitle', value: 'Get Connected Today!', category: 'cta' },
          { key: 'ctaDescription', value: 'No Deposit Required! FREE Router + Drop Wire included with every plan.', category: 'cta' },
          { key: 'ctaButtonText', value: 'Get Connection Now', category: 'cta' },
          { key: 'ctaButtonUrl', value: '/apply', category: 'cta' },
          { key: 'footerDescription', value: "Nepal's leading ISP offering high-speed fiber internet, IPTV, and enterprise solutions.", category: 'footer' },
          { key: 'tagline', value: 'Connect at the speed of life', category: 'general' }
        ]);
      }

      console.log('Auto-seed completed: packages, services, FAQs, testimonials, coverage, hero, banners, settings.');
    }
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
})();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const adminBuildPath = path.join(__dirname, '..', 'admin', 'dist');

app.use('/admin', express.static(adminBuildPath));
app.use(express.static(clientBuildPath));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
