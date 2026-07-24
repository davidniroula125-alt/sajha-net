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

console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);

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
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ 
    status: 'ok',
    mongodb: !!process.env.MONGODB_URI,
    jwt: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    mongoState: states[state] || state,
    uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    uriHost: process.env.MONGODB_URI ? process.env.MONGODB_URI.split('@')[1] : 'none'
  });
});

app.get('/api/seed-run', async (req, res) => {
  if (process.env.SEED_SECRET !== 'sajha-seed-2026') {
    return res.status(403).json({ message: 'forbidden' });
  }
  try {
    const User = require('./models/User');
    const Package = require('./models/Package');
    const Service = require('./models/Service');
    const Testimonial = require('./models/Testimonial');
    const FAQ = require('./models/FAQ');
    const Hero = require('./models/Hero');
    const Banner = require('./models/Banner');
    const Setting = require('./models/Setting');

    await Promise.all([
      User.deleteMany(), Package.deleteMany(), Service.deleteMany(),
      Testimonial.deleteMany(), FAQ.deleteMany(), Hero.deleteMany(),
      Banner.deleteMany(), Setting.deleteMany()
    ]);

    await User.create([
      { name: 'Admin', email: 'admin@sajhanet.com', password: 'admin123', role: 'admin', phone: '+977-970910187' },
      { name: 'Ram Shrestha', email: 'ram@example.com', password: 'password123', role: 'customer', phone: '+977-9841234567', address: { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '1' } }
    ]);

    await Package.create([
      { name: 'Bronze', speed: 80, price: { monthly: 6500 }, description: 'Basic internet plan', features: ['80 Mbps Speed', 'Unlimited Data', '24/7 Support'], type: 'internet', isActive: true, sortOrder: 1 },
      { name: 'Silver', speed: 100, price: { monthly: 7500 }, description: 'Standard internet plan', features: ['100 Mbps Speed', 'Unlimited Data', '24/7 Support', 'Free Router'], type: 'internet', isActive: true, sortOrder: 2, isPopular: true },
      { name: 'Gold', speed: 150, price: { monthly: 8500 }, description: 'Premium internet plan', features: ['150 Mbps Speed', 'Unlimited Data', '24/7 Support', 'Free Router', 'Free IPTV'], type: 'internet', isActive: true, sortOrder: 3 },
      { name: 'Platinum', speed: 200, price: { monthly: 9500 }, description: 'Ultimate internet plan', features: ['200 Mbps Speed', 'Unlimited Data', '24/7 Support', 'Free Router', 'Free IPTV', 'Priority Support'], type: 'internet', isActive: true, sortOrder: 4 },
      { name: 'Essential', speed: 80, price: { monthly: 8500 }, description: 'Internet + IPTV bundle', features: ['80 Mbps Speed', 'Unlimited Data', 'IPTV Included', 'Free Router'], type: 'combo', isActive: true, sortOrder: 5, includes: { tv: true } },
      { name: 'Enhanced', speed: 150, price: { monthly: 9500 }, description: 'Internet + IPTV bundle', features: ['150 Mbps Speed', 'Unlimited Data', 'IPTV Included', 'Free Router', '24/7 Support'], type: 'combo', isActive: true, sortOrder: 6, includes: { tv: true } },
      { name: 'Premium', speed: 200, price: { monthly: 10500 }, description: 'Internet + IPTV bundle', features: ['200 Mbps Speed', 'Unlimited Data', 'IPTV Included', 'Free Router', 'Priority Support'], type: 'combo', isActive: true, sortOrder: 7, includes: { tv: true } }
    ]);

    await Service.create([
      { name: 'High-Speed Internet', slug: 'high-speed-internet', description: 'Fiber-optic internet up to 200 Mbps', icon: 'FiWifi', isActive: true, sortOrder: 1 },
      { name: 'IPTV Service', slug: 'iptv-service', description: 'HD channels with crystal clear quality', icon: 'FiMonitor', isActive: true, sortOrder: 2 },
      { name: '24/7 Support', slug: '24-7-support', description: 'Round the clock technical support', icon: 'FiHeadphones', isActive: true, sortOrder: 3 },
      { name: 'Free Installation', slug: 'free-installation', description: 'No setup fees, free router and drop wire', icon: 'FiTool', isActive: true, sortOrder: 4 }
    ]);

    await Testimonial.create([
      { name: 'Ram Shrestha', location: 'Itahari', content: 'Best ISP in Itahari! Speed is consistent.', rating: 5, isActive: true, package: 'Gold' },
      { name: 'Sita Thapa', location: 'Itahari', content: 'Great service and support team.', rating: 5, isActive: true, package: 'Silver' },
      { name: 'Hari Bahadur', location: 'Dharan', content: 'Perfect for online classes and streaming.', rating: 4, isActive: true, package: 'Bronze' },
      { name: 'Gita Rai', location: 'Itahari', content: 'Reliable connection for my work from home.', rating: 5, isActive: true, package: 'Gold' },
      { name: 'Binod Magar', location: 'Biratnagar', content: 'Low latency, perfect for gaming!', rating: 5, isActive: true, package: 'Platinum' }
    ]);

    await FAQ.create([
      { question: 'How do I apply for a new connection?', answer: 'You can apply online through our website or visit our office in Itahari.', category: 'general', sortOrder: 1, isActive: true },
      { question: 'What documents are required?', answer: 'Citizenship or any government-issued ID.', category: 'general', sortOrder: 2, isActive: true },
      { question: 'How long does installation take?', answer: 'Usually within 24-48 hours after application approval.', category: 'installation', sortOrder: 3, isActive: true },
      { question: 'Is there a deposit required?', answer: 'No, there is no deposit. We provide free router and drop wire.', category: 'billing', sortOrder: 4, isActive: true },
      { question: 'How do I report an issue?', answer: 'Call us at 970910187 or file a complaint through the customer portal.', category: 'support', sortOrder: 5, isActive: true }
    ]);

    await Hero.create({ title: "Nepal's Most Reliable High-Speed Internet", subtitle: 'Experience blazing fast internet in Itahari with Sajha Net', ctaButtons: [{ text: 'Get Connected', url: '/packages', primary: true }, { text: 'View Plans', url: '/packages', primary: false }], badge: "Nepal's Fastest Growing ISP", stats: [{ label: 'Customers', value: '5000+', icon: 'FiUsers' }, { label: 'Uptime', value: '99.9%', icon: 'FiTrendingUp' }], isActive: true });

    await Banner.create([
      { title: 'Free Installation Offer', description: 'Get free installation on all plans', link: '/packages', type: 'offer', isActive: true, sortOrder: 1 },
      { title: 'Refer a Friend', description: 'Earn rewards for every referral', link: '/offers', type: 'promo', isActive: true, sortOrder: 2 }
    ]);

    await Setting.create([
      { key: 'companyName', value: 'Sajha Net' },
      { key: 'phone1', value: '9705390890' },
      { key: 'phone2', value: '9709110186' },
      { key: 'phone3', value: '970910187' },
      { key: 'email', value: 'info@sajhanet.com' },
      { key: 'address', value: 'Itahari, Nepal' },
      { key: 'facebook', value: 'https://facebook.com/sajhanet' },
      { key: 'copyright', value: '© 2026 Sajha Net. All rights reserved.' }
    ]);

    res.json({ success: true, message: 'Database seeded successfully!' });
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
