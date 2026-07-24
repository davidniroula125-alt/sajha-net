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

const app = express();
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
  heartbeatFrequencyMS: 30000
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/reseed', async (req, res) => {
  if (process.env.SEED_SECRET !== 'sajha-seed-2026') return res.status(403).json({ message: 'forbidden' });
  try {
    const Package = require('./models/Package');
    const Setting = require('./models/Setting');
    const User = require('./models/User');
    const Testimonial = require('./models/Testimonial');
    const FAQ = require('./models/FAQ');
    const Hero = require('./models/Hero');
    const Banner = require('./models/Banner');
    const Service = require('./models/Service');
    const Blog = require('./models/Blog');

    await Promise.all([
      Package.deleteMany(), Testimonial.deleteMany(), FAQ.deleteMany(),
      Hero.deleteMany(), Banner.deleteMany(), Service.deleteMany(), Setting.deleteMany(), Blog.deleteMany()
    ]);

    const admin = await User.findOne({ role: 'admin' });

    await Package.insertMany([
      { name: 'Bronze', slug: 'bronze', speed: 80, type: 'internet', price: { monthly: 6500, quarterly: 18000, halfYearly: 36000, yearly: 6500 }, billingCycles: [{ cycle: 'monthly', price: 6500 }, { cycle: 'quarterly', price: 18000, discount: 0 }, { cycle: 'halfYearly', price: 36000, discount: 0 }, { cycle: 'yearly', price: 6500 }], installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Browsing', 'Social Media', 'Light Streaming'], highlights: ['No Deposit', 'Free Router', 'Free Drop Wire'], isPopular: false, isRecommended: false, sortOrder: 1, description: 'Bronze package - 80 Mbps fiber internet for light to moderate usage.', shortDescription: '80 Mbps Fiber Internet' },
      { name: 'Silver', slug: 'silver', speed: 100, type: 'internet', price: { monthly: 7500, quarterly: 21000, halfYearly: 42000, yearly: 7500 }, billingCycles: [{ cycle: 'monthly', price: 7500 }, { cycle: 'quarterly', price: 21000, discount: 0 }, { cycle: 'halfYearly', price: 42000, discount: 0 }, { cycle: 'yearly', price: 7500 }], installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family', 'Streaming', 'HD Video'], highlights: ['No Deposit', 'Free Router', 'Fast Speed'], isPopular: true, isRecommended: false, sortOrder: 2, description: 'Silver package - 100 Mbps fiber internet for families.', shortDescription: '100 Mbps Fiber Internet' },
      { name: 'Gold', slug: 'gold', speed: 150, type: 'internet', price: { monthly: 8500, quarterly: 24000, halfYearly: 48000, yearly: 8500 }, billingCycles: [{ cycle: 'monthly', price: 8500 }, { cycle: 'quarterly', price: 24000, discount: 0 }, { cycle: 'halfYearly', price: 48000, discount: 0 }, { cycle: 'yearly', price: 8500 }], installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Multiple Devices', 'HD Streaming', 'Gaming'], highlights: ['No Deposit', 'Free Router', 'High Speed'], isPopular: false, isRecommended: true, sortOrder: 3, description: 'Gold package - 150 Mbps fiber internet for power users.', shortDescription: '150 Mbps Fiber Internet' },
      { name: 'Platinum', slug: 'platinum', speed: 200, type: 'internet', price: { monthly: 9500, quarterly: 26000, halfYearly: 52000, yearly: 9500 }, billingCycles: [{ cycle: 'monthly', price: 9500 }, { cycle: 'quarterly', price: 26000, discount: 0 }, { cycle: 'halfYearly', price: 52000, discount: 0 }, { cycle: 'yearly', price: 9500 }], installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Power Users', '4K Streaming', 'Multiple Users'], highlights: ['No Deposit', 'Free Router', 'Premium Speed'], isPopular: false, isRecommended: true, sortOrder: 4, description: 'Platinum package - 200 Mbps fiber internet for power users.', shortDescription: '200 Mbps Fiber Internet' },
      { name: 'Essential', slug: 'essential', speed: 80, type: 'combo', price: { monthly: 8500, quarterly: 24000, halfYearly: 48000, yearly: 8500 }, billingCycles: [{ cycle: 'monthly', price: 8500 }, { cycle: 'quarterly', price: 24000, discount: 0 }, { cycle: 'halfYearly', price: 48000, discount: 0 }, { cycle: 'yearly', price: 8500 }], installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Entertainment', 'Family', 'TV + Internet'], highlights: ['Internet + IPTV', 'No Deposit', 'Free Router'], isPopular: false, isRecommended: false, sortOrder: 5, description: 'Essential combo - 80 Mbps internet + IP TV.', shortDescription: '80 Mbps + IP TV Bundle' },
      { name: 'Enhanced', slug: 'enhanced', speed: 150, type: 'combo', price: { monthly: 9500, quarterly: 26000, halfYearly: 52000, yearly: 9500 }, billingCycles: [{ cycle: 'monthly', price: 9500 }, { cycle: 'quarterly', price: 26000, discount: 0 }, { cycle: 'halfYearly', price: 52000, discount: 0 }, { cycle: 'yearly', price: 9500 }], installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family Entertainment', 'HD Streaming + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'High Speed'], isPopular: true, isRecommended: false, sortOrder: 6, description: 'Enhanced combo - 150 Mbps internet + IP TV.', shortDescription: '150 Mbps + IP TV Bundle' },
      { name: 'Premium', slug: 'premium', speed: 200, type: 'combo', price: { monthly: 10500, quarterly: 28000, halfYearly: 56000, yearly: 10500 }, billingCycles: [{ cycle: 'monthly', price: 10500 }, { cycle: 'quarterly', price: 28000, discount: 0 }, { cycle: 'halfYearly', price: 56000, discount: 0 }, { cycle: 'yearly', price: 10500 }], installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Ultimate Bundle', 'Power Users', '4K + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'Ultimate Speed'], isPopular: false, isRecommended: true, sortOrder: 7, description: 'Premium combo - 200 Mbps internet + IP TV.', shortDescription: '200 Mbps + IP TV Bundle' },
      { name: 'Business Starter', slug: 'business-starter', speed: 100, type: 'business', price: { monthly: 7500, quarterly: 21000, halfYearly: 42000, yearly: 7500 }, billingCycles: [{ cycle: 'monthly', price: 7500 }, { cycle: 'quarterly', price: 21000, discount: 0 }, { cycle: 'halfYearly', price: 42000, discount: 0 }, { cycle: 'yearly', price: 7500 }], installationCharge: 0, image: '', badge: '', features: ['100 Mbps Dedicated', 'Fiber Connection', '99.9% Uptime SLA', '24x7 Priority Support', 'Static IP', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Small Business', 'Startups'], highlights: ['SLA Guarantee', 'Priority Support', 'Static IP'], isPopular: false, isRecommended: false, sortOrder: 8, description: 'Business Starter - 100 Mbps dedicated fiber.', shortDescription: '100 Mbps Business Internet' },
      { name: 'Business Pro', slug: 'business-pro', speed: 300, type: 'business', price: { monthly: 15000, quarterly: 40000, halfYearly: 80000, yearly: 15000 }, billingCycles: [{ cycle: 'monthly', price: 15000 }, { cycle: 'quarterly', price: 40000, discount: 0 }, { cycle: 'halfYearly', price: 80000, discount: 0 }, { cycle: 'yearly', price: 15000 }], installationCharge: 0, image: '', badge: '', features: ['300 Mbps Dedicated', 'Fiber Connection', '99.99% Uptime SLA', '24x7 Priority Support', 'Static IP', 'Managed WiFi', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: true, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Growing Business', 'Offices'], highlights: ['Enterprise SLA', 'Managed WiFi', 'Dedicated Support'], isPopular: false, isRecommended: true, sortOrder: 9, description: 'Business Pro - 300 Mbps dedicated fiber.', shortDescription: '300 Mbps Business Internet' }
    ]);

    await Service.insertMany([
      { name: 'Fiber Internet', slug: 'fiber-internet', description: 'High-speed fiber optic internet.', shortDescription: 'Ultra-fast fiber connectivity', icon: 'FaWifi', features: ['Speeds up to 1 Gbps', '99.9% Uptime', 'Unlimited Data', 'Free Router'], category: 'internet', sortOrder: 1 },
      { name: 'NetTV', slug: 'nettv', description: 'IPTV service with 200+ channels.', shortDescription: 'Premium IPTV service', icon: 'FaTv', features: ['200+ Channels', 'HD & 4K'], category: 'entertainment', sortOrder: 2 },
      { name: 'Mesh WiFi', slug: 'mesh-wifi', description: 'Whole-home WiFi coverage.', shortDescription: 'Seamless home coverage', icon: 'FaHome', features: ['Whole-home Coverage', 'Easy Setup'], category: 'addons', sortOrder: 3 }
    ]);

    await Testimonial.insertMany([
      { name: 'Aarav Sharma', location: 'Itahari', rating: 5, content: 'Best ISP in Nepal!', package: '100 Mbps', isFeatured: true, sortOrder: 1 },
      { name: 'Priya Thapa', location: 'Lalitpur', rating: 5, content: 'Stable connection even during peak hours.', package: '200 Mbps', isFeatured: true, sortOrder: 2 }
    ]);

    await FAQ.insertMany([
      { question: 'How do I apply for a new connection?', answer: 'Apply online or visit our office.', category: 'installation', sortOrder: 1 },
      { question: 'What speeds are available?', answer: 'We offer speeds from 50 Mbps to 1 Gbps.', category: 'packages', sortOrder: 2 }
    ]);

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

    await Banner.insertMany([
      { title: 'No Deposit Required!', description: 'Get connected without any deposit. FREE Router + Drop Wire included with every plan!', type: 'offer', position: 'homepage', isActive: true, sortOrder: 1 },
      { title: 'Super Fast Fiber Internet & HD TV', description: 'Internet + IP TV combo plans starting at NPR 8,500/year. IP TV Service FREE with 5G Router for only NPR 1,000!', type: 'promo', position: 'homepage', isActive: true, sortOrder: 2 }
    ]);

    await Setting.insertMany([
      { key: 'companyName', value: 'Sajha Net Pvt. Ltd.', category: 'general' },
      { key: 'contactEmail', value: 'sajhanet2025@gmail.com', category: 'contact' },
      { key: 'contactPhone', value: '9705390890', category: 'contact' },
      { key: 'contactPhone2', value: '9709110186', category: 'contact' },
      { key: 'technicalPhone', value: '970910187', category: 'contact' },
      { key: 'contactAddress', value: 'Itahari, Nepal', category: 'contact' },
      { key: 'facebook', value: 'https://www.facebook.com/sajhanet', category: 'social' },
      { key: 'copyrightText', value: '© 2026 Sajha Net Pvt. Ltd. All rights reserved.', category: 'footer' },
      { key: 'tagline', value: 'Connect at the speed of life', category: 'general' }
    ]);

    await Blog.deleteMany({});
    const blogs = [
      { title: 'Why Fiber Internet is the Future of Connectivity in Itahari', slug: 'why-fiber-internet-future-itahari', category: 'technology', excerpt: 'Fiber optic internet is transforming how Itahari stays connected.', content: '<h2>The Fiber Revolution</h2><p>Fiber internet offers speeds up to 200 Mbps with unlimited data.</p>', tags: ['fiber', 'Itahari'], featuredImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80', author: admin?._id, isPublished: true, views: 342, likes: 28, sortOrder: 1 },
      { title: 'How to Choose the Right Internet Package', slug: 'choose-right-internet-package', category: 'tips', excerpt: 'A complete guide to picking the perfect Sajha Net package.', content: '<h2>Understanding Your Needs</h2><p>Choose the right plan for your household.</p>', tags: ['package', 'guide'], featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80', author: admin?._id, isPublished: true, views: 256, likes: 19, sortOrder: 2 },
      { title: 'Sajha Net Launches Free IPTV Service', slug: 'sajha-net-free-iptv-combo-packages', category: 'offers', excerpt: 'Exciting news! Free IPTV service with all combo packages.', content: '<h2>Entertainment Just Got Better</h2><p>200+ HD channels included FREE.</p>', tags: ['IPTV', 'combo'], featuredImage: 'https://images.unsplash.com/photo-1574694238031-813a5b75e5d5?w=1200&q=80', author: admin?._id, isPublished: true, views: 412, likes: 35, sortOrder: 3 },
      { title: '5 Tips to Boost Your Internet Speed', slug: '5-tips-boost-internet-speed-home', category: 'tips', excerpt: 'Simple tips to maximize your Sajha Net connection.', content: '<h2>Getting the Most Out of Your Connection</h2><p>Restart your router regularly.</p>', tags: ['speed', 'WiFi'], featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', author: admin?._id, isPublished: true, views: 298, likes: 22, sortOrder: 4 },
      { title: 'Top 5 Benefits of Fiber for Students', slug: 'top-5-benefits-fiber-internet-students', category: 'general', excerpt: 'Why fiber internet is essential for students in Itahari.', content: '<h2>Empowering Students</h2><p>Fiber internet for online classes and research.</p>', tags: ['student', 'education'], featuredImage: 'https://images.unsplash.com/photo-1523040333635-83785dc02b3c?w=1200&q=80', author: admin?._id, isPublished: true, views: 224, likes: 18, sortOrder: 5 }
    ];
    await Blog.insertMany(blogs);

    res.json({ success: true, message: 'Database reseeded!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
