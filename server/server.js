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
  if (process.env.SEED_SECRET !== 'sajha-reseed-2026') return res.status(403).json({ message: 'forbidden' });
  try {
    const mongoose = require('mongoose');
    const Package = require('./models/Package');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sajhanet');
    await Package.deleteMany();
    await Package.insertMany([
      { name: 'Bronze', slug: 'bronze', speed: 80, type: 'internet', billingCycle: 'yearly', price: 6500, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Browsing', 'Social Media', 'Light Streaming'], highlights: ['No Deposit', 'Free Router', 'Free Drop Wire'], isPopular: false, isRecommended: false, sortOrder: 1, description: 'Bronze package — 80 Mbps fiber internet for light to moderate usage.', shortDescription: '80 Mbps Fiber Internet' },
      { name: 'Silver', slug: 'silver', speed: 100, type: 'internet', billingCycle: 'yearly', price: 7500, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family', 'Streaming', 'HD Video'], highlights: ['No Deposit', 'Free Router', 'Fast Speed'], isPopular: true, isRecommended: false, sortOrder: 2, description: 'Silver package — 100 Mbps fiber internet for families.', shortDescription: '100 Mbps Fiber Internet' },
      { name: 'Gold', slug: 'gold', speed: 150, type: 'internet', billingCycle: 'yearly', price: 8500, installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Multiple Devices', 'HD Streaming', 'Gaming'], highlights: ['No Deposit', 'Free Router', 'High Speed'], isPopular: false, isRecommended: true, sortOrder: 3, description: 'Gold package — 150 Mbps fiber internet for power users.', shortDescription: '150 Mbps Fiber Internet' },
      { name: 'Platinum', slug: 'platinum', speed: 200, type: 'internet', billingCycle: 'yearly', price: 9500, installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Power Users', '4K Streaming', 'Multiple Users'], highlights: ['No Deposit', 'Free Router', 'Premium Speed'], isPopular: false, isRecommended: true, sortOrder: 4, description: 'Platinum package — 200 Mbps fiber internet for power users.', shortDescription: '200 Mbps Fiber Internet' },
      { name: 'Essential', slug: 'essential', speed: 80, type: 'combo', billingCycle: 'yearly', price: 8500, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Entertainment', 'Family', 'TV + Internet'], highlights: ['Internet + IPTV', 'No Deposit', 'Free Router'], isPopular: false, isRecommended: false, sortOrder: 5, description: 'Essential combo — 80 Mbps internet + IP TV.', shortDescription: '80 Mbps + IP TV Bundle' },
      { name: 'Enhanced', slug: 'enhanced', speed: 150, type: 'combo', billingCycle: 'yearly', price: 9500, installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family Entertainment', 'HD Streaming + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'High Speed'], isPopular: true, isRecommended: false, sortOrder: 6, description: 'Enhanced combo — 150 Mbps internet + IP TV.', shortDescription: '150 Mbps + IP TV Bundle' },
      { name: 'Premium', slug: 'premium', speed: 200, type: 'combo', billingCycle: 'yearly', price: 10500, installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Ultimate Bundle', 'Power Users', '4K + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'Ultimate Speed'], isPopular: false, isRecommended: true, sortOrder: 7, description: 'Premium combo — 200 Mbps internet + IP TV.', shortDescription: '200 Mbps + IP TV Bundle' },
      { name: 'Business Starter', slug: 'business-starter', speed: 100, type: 'business', billingCycle: 'yearly', price: 7500, installationCharge: 0, image: '', badge: '', features: ['100 Mbps Dedicated', 'Fiber Connection', '99.9% Uptime SLA', '24x7 Priority Support', 'Static IP', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Small Business', 'Startups'], highlights: ['SLA Guarantee', 'Priority Support', 'Static IP'], isPopular: false, isRecommended: false, sortOrder: 8, description: 'Business Starter — 100 Mbps dedicated fiber.', shortDescription: '100 Mbps Business Internet' },
      { name: 'Business Pro', slug: 'business-pro', speed: 300, type: 'business', billingCycle: 'yearly', price: 15000, installationCharge: 0, image: '', badge: '', features: ['300 Mbps Dedicated', 'Fiber Connection', '99.99% Uptime SLA', '24x7 Priority Support', 'Static IP', 'Managed WiFi', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: true, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Growing Business', 'Offices'], highlights: ['Enterprise SLA', 'Managed WiFi', 'Dedicated Support'], isPopular: false, isRecommended: true, sortOrder: 9, description: 'Business Pro — 300 Mbps dedicated fiber.', shortDescription: '300 Mbps Business Internet' }
    ]);
    res.json({ success: true, message: 'Packages reseeded!' });
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
