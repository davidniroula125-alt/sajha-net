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

    await Promise.all([
      Package.deleteMany(), Testimonial.deleteMany(), FAQ.deleteMany(),
      Hero.deleteMany(), Banner.deleteMany(), Service.deleteMany(), Setting.deleteMany()
    ]);

    await User.deleteMany();
    await User.create([
      { name: 'Admin', email: 'admin@sajhanet.com', password: 'admin123', role: 'admin', phone: '+977-970910187' },
      { name: 'Ram Shrestha', email: 'ram@example.com', password: 'password123', role: 'customer', phone: '+977-9841234567', address: { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '1' } }
    ]);

    await Package.insertMany([
      { name: 'Bronze', speed: 80, type: 'internet', price: { monthly: 6500, quarterly: 18000, halfYearly: 36000, yearly: 72000 }, installationCharge: 0, features: ['80 Mbps Speed', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, unlimitedData: true }, idealFor: ['Browsing', 'Social Media', 'Light Streaming'], highlights: ['No Deposit', 'Free Router', 'Free Drop Wire'], isPopular: false, sortOrder: 1 },
      { name: 'Silver', speed: 100, type: 'internet', price: { monthly: 7500, quarterly: 21000, halfYearly: 42000, yearly: 84000 }, installationCharge: 0, features: ['100 Mbps Speed', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, unlimitedData: true }, idealFor: ['Family', 'Streaming', 'HD Video'], highlights: ['No Deposit', 'Free Router', 'Fast Speed'], isPopular: true, sortOrder: 2 },
      { name: 'Gold', speed: 150, type: 'internet', price: { monthly: 8500, quarterly: 24000, halfYearly: 48000, yearly: 96000 }, installationCharge: 0, features: ['150 Mbps Speed', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, unlimitedData: true }, idealFor: ['Multiple Devices', 'HD Streaming', 'Gaming'], highlights: ['No Deposit', 'Free Router', 'High Speed'], isPopular: false, sortOrder: 3 },
      { name: 'Platinum', speed: 200, type: 'internet', price: { monthly: 9500, quarterly: 26000, halfYearly: 52000, yearly: 108000 }, installationCharge: 0, features: ['200 Mbps Speed', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, unlimitedData: true }, idealFor: ['Power Users', '4K Streaming', 'Multiple Users'], highlights: ['No Deposit', 'Free Router', 'Premium Speed'], isPopular: false, sortOrder: 4 },
      { name: 'Essential', speed: 80, type: 'combo', price: { monthly: 8500, quarterly: 24000, halfYearly: 48000, yearly: 96000 }, installationCharge: 0, features: ['80 Mbps Internet + IP TV', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, tv: true, unlimitedData: true }, idealFor: ['Entertainment', 'Family', 'TV + Internet'], highlights: ['Internet + IPTV', 'No Deposit', 'Free Router'], isPopular: false, sortOrder: 5 },
      { name: 'Enhanced', speed: 150, type: 'combo', price: { monthly: 9500, quarterly: 26000, halfYearly: 52000, yearly: 108000 }, installationCharge: 0, features: ['150 Mbps Internet + IP TV', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, tv: true, unlimitedData: true }, idealFor: ['Family Entertainment', 'HD Streaming + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'High Speed'], isPopular: true, sortOrder: 6 },
      { name: 'Premium', speed: 200, type: 'combo', price: { monthly: 10500, quarterly: 28000, halfYearly: 56000, yearly: 120000 }, installationCharge: 0, features: ['200 Mbps Internet + IP TV', 'Fiber Connection', '99.9% Uptime', '24x7 Support', 'FREE Router + Drop Wire', 'No Deposit Required'], includes: { router: true, tv: true, unlimitedData: true }, idealFor: ['Ultimate Bundle', 'Power Users', '4K + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'Ultimate Speed'], isPopular: false, sortOrder: 7 },
      { name: 'Business Starter', speed: 100, type: 'business', price: { monthly: 7500, quarterly: 21000, halfYearly: 42000, yearly: 84000 }, installationCharge: 0, features: ['100 Mbps Dedicated', 'Fiber Connection', '99.9% Uptime SLA', '24x7 Priority Support', 'Static IP'], includes: { router: true, unlimitedData: true }, idealFor: ['Small Business', 'Startups'], highlights: ['SLA Guarantee', 'Priority Support', 'Static IP'], isPopular: false, sortOrder: 8 },
      { name: 'Business Pro', speed: 300, type: 'business', price: { monthly: 15000, quarterly: 40000, halfYearly: 80000, yearly: 168000 }, installationCharge: 0, features: ['300 Mbps Dedicated', 'Fiber Connection', '99.99% Uptime SLA', '24x7 Priority Support', 'Static IP', 'Managed WiFi'], includes: { router: true, mesh: true, unlimitedData: true }, idealFor: ['Growing Business', 'Offices'], highlights: ['Enterprise SLA', 'Managed WiFi', 'Dedicated Support'], isPopular: false, sortOrder: 9 }
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

    await Testimonial.insertMany([
      { name: 'Aarav Sharma', location: 'Itahari', rating: 5, content: 'Best ISP in Nepal! Super fast speeds and excellent customer support. Highly recommended!', package: '100 Mbps', isFeatured: true, sortOrder: 1 },
      { name: 'Priya Thapa', location: 'Lalitpur', rating: 5, content: 'Switched from another ISP and the difference is night and day. Stable connection even during peak hours.', package: '200 Mbps', isFeatured: true, sortOrder: 2 },
      { name: 'Bikash Gurung', location: 'Pokhara', rating: 4, content: 'Great service for the price. Installation was quick and the team was professional.', package: '50 Mbps', isFeatured: true, sortOrder: 3 },
      { name: 'Sita Maharjan', location: 'Bhaktapur', rating: 5, content: 'Perfect for streaming and gaming. No more buffering! The mesh WiFi covers our entire home.', package: '300 Mbps', isFeatured: false, sortOrder: 4 },
      { name: 'Rajan Das', location: 'Chitwan', rating: 5, content: 'As a business owner, I need reliable internet. Sajha Net delivers 99.99% uptime as promised.', package: 'Business 600 Mbps', isFeatured: true, sortOrder: 5 }
    ]);

    await FAQ.insertMany([
      { question: 'How do I apply for a new connection?', answer: 'You can apply online through our website or visit your nearest Sajha Net office. Fill out the application form and our team will contact you within 24 hours.', category: 'installation', sortOrder: 1 },
      { question: 'What is the installation process?', answer: 'After application approval, our technical team will visit your location for fiber installation. The process typically takes 1-3 days depending on your area.', category: 'installation', sortOrder: 2 },
      { question: 'What speeds are available?', answer: 'We offer speeds from 50 Mbps to 1 Gbps. Choose the plan that best fits your needs. You can upgrade or downgrade anytime.', category: 'packages', sortOrder: 3 },
      { question: 'Is there a data limit?', answer: 'No, all our plans come with unlimited data. We believe in fair and transparent internet access.', category: 'packages', sortOrder: 4 },
      { question: 'How do I pay my bill?', answer: 'You can pay through eSewa, Khalti, bank transfer, or visit our office for cash payment. Online payment is available 24/7.', category: 'billing', sortOrder: 5 },
      { question: 'What should I do if my internet is slow?', answer: 'First, restart your router. If the issue persists, check our troubleshooting guide or contact our support team at 9705390890.', category: 'technical', sortOrder: 6 },
      { question: 'How do I report a complaint?', answer: 'You can submit a complaint through our support page, call us at 9705390890, or use our live chat feature.', category: 'support', sortOrder: 7 },
      { question: 'What is the minimum contract period?', answer: 'We offer both monthly and annual plans. Annual plans come with significant discounts. There is no lock-in period for monthly plans.', category: 'billing', sortOrder: 8 }
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
      { title: 'Super Fast Fiber Internet & HD TV', description: 'Internet + IP TV combo plans starting at Rs. 8500/month. IP TV Service FREE with 5G Router for only Rs. 1000!', type: 'promo', position: 'homepage', isActive: true, sortOrder: 2 },
      { title: 'Get Connected Today!', description: 'Call us at 9705390890 or visit our office. Quick installation within 24-48 hours.', type: 'promo', position: 'homepage', isActive: true, sortOrder: 3 }
    ]);

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
      { key: 'ctaDescription', value: 'No Deposit Required! FREE Router + Drop Wire included with every plan. Switch to Sajha Net today.', category: 'cta' },
      { key: 'ctaButtonText', value: 'Get Connection Now', category: 'cta' },
      { key: 'ctaButtonUrl', value: '/apply', category: 'cta' },
      { key: 'footerDescription', value: "Nepal's leading internet service provider offering high-speed fiber internet, IPTV, and enterprise solutions. Connect at the speed of life.", category: 'footer' },
      { key: 'copyrightText', value: '© 2026 Sajha Net Pvt. Ltd. All rights reserved.', category: 'footer' },
      { key: 'tagline', value: 'Connect at the speed of life', category: 'general' }
    ]);

    const Blog = require('./models/Blog');
    const admin = await User.findOne({ role: 'admin' });
    await Blog.deleteMany({});
    await Blog.insertMany([
      {
        title: 'Why Fiber Internet is the Future of Connectivity in Itahari',
        slug: 'why-fiber-internet-future-itahari',
        category: 'technology',
        excerpt: 'Fiber optic internet is transforming how Itahari stays connected. Learn why fiber is the gold standard for home and business internet.',
        content: `<h2>The Fiber Revolution in Itahari</h2><p>Itahari, one of the fastest-growing cities in eastern Nepal, is experiencing a digital transformation. As businesses expand, students pursue online education, and families stream entertainment, the demand for reliable, high-speed internet has never been greater.</p><h2>Why Fiber Optic?</h2><p>Fiber optic internet transmits data through thin glass cables using light signals, offering speeds up to 100x faster than traditional copper connections.</p><h2>How Sajha Net is Leading the Way</h2><p>Sajha Net has been at the forefront of bringing fiber internet to Itahari and surrounding areas. With plans starting at just Rs. 6,500/month, we make high-speed internet accessible to everyone.</p><h2>Make the Switch Today</h2><p>Ready to experience the fiber difference? Contact Sajha Net at 9705390890 or visit our office in Itahari to get started with free installation.</p>`,
        tags: ['fiber internet', 'Itahari', 'ISP Nepal', 'high-speed internet', 'broadband'],
        featuredImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 342,
        likes: 28,
        sortOrder: 1
      },
      {
        title: 'How to Choose the Right Internet Package for Your Home',
        slug: 'choose-right-internet-package-home',
        category: 'tips',
        excerpt: 'Not sure which internet plan suits your household? Here is a complete guide to help you pick the perfect Sajha Net package.',
        content: `<h2>Understanding Your Internet Needs</h2><p>Choosing the right internet package can be overwhelming with so many options available. Here is how to pick the perfect one for your household.</p><h2>For Light Users (1-2 people)</h2><p>If you primarily browse social media, check emails, and do basic streaming: the Bronze Plan (80 Mbps — Rs. 6,500/month) is ideal.</p><h2>For Medium Users (2-4 people)</h2><p>The Silver Plan (100 Mbps — Rs. 7,500/month) is recommended for families who stream, video call, and have multiple devices.</p><h2>For Heavy Users (4+ people)</h2><p>The Gold Plan (150 Mbps — Rs. 8,500/month) or Platinum (200 Mbps — Rs. 9,500/month) support 4K streaming and competitive gaming.</p><h2>Want TV + Internet?</h2><p>Our combo bundles include IPTV service: Essential, Enhanced, and Premium plans.</p>`,
        tags: ['internet package', 'home internet', 'broadband plan', 'choose ISP', 'Itahari internet'],
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 256,
        likes: 19,
        sortOrder: 2
      },
      {
        title: 'Complete Guide to Setting Up Home WiFi with Sajha Net',
        slug: 'complete-guide-setup-home-wifi',
        category: 'fiber-guide',
        excerpt: 'Step-by-step guide to setting up your home WiFi network after getting connected with Sajha Net fiber internet.',
        content: `<h2>Welcome to Your New Fiber Connection!</h2><p>Congratulations on choosing Sajha Net for your home internet. Here is how to optimize your WiFi setup for the best experience.</p><h2>Step 1: Router Placement</h2><p>Place the router in a central location in your home, elevated on a shelf or mounted on a wall. Avoid placing near walls, metal objects, or electronic devices.</p><h2>Step 2: Connect Your Devices</h2><p>Our technicians set up your router with a default WiFi name and password. You can find the credentials on the router label and connect your devices.</p><h2>Step 3: Optimize WiFi Coverage</h2><p>For larger homes in Itahari, consider our Mesh WiFi add-on for complete coverage. Use WiFi extenders for dead zones.</p><h2>Step 4: Secure Your Network</h2><p>Change the default router admin password, use WPA3 or WPA2 encryption, and create a strong WiFi password.</p><h2>Step 5: Speed Test</h2><p>Verify your connection speed at speedtest.net or fast.com. If you are not getting the speeds you are paying for, contact our support team.</p>`,
        tags: ['WiFi setup', 'home network', 'router configuration', 'internet tips', 'fiber installation'],
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 189,
        likes: 15,
        sortOrder: 3
      },
      {
        title: 'Sajha Net Launches Free IPTV Service with Combo Packages',
        slug: 'sajha-net-free-iptv-combo-packages',
        category: 'offers',
        excerpt: 'Exciting news! Sajha Net now offers free IPTV service with all combo packages. Watch 200+ HD channels including Nepali, Hindi, and English content.',
        content: `<h2>Entertainment Just Got Better in Itahari!</h2><p>Sajha Net is thrilled to announce that our combo packages now include FREE IPTV service with 200+ HD channels.</p><h2>What is IPTV?</h2><p>IPTV (Internet Protocol Television) delivers TV channels through your internet connection instead of traditional cable or satellite.</p><h2>Available Combo Plans</h2><ul><li><strong>Essential:</strong> 80 Mbps Internet + IPTV — Rs. 8,500/month</li><li><strong>Enhanced:</strong> 150 Mbps Internet + IPTV — Rs. 9,500/month</li><li><strong>Premium:</strong> 200 Mbps Internet + IPTV — Rs. 10,500/month</li></ul><h2>Channel Lineup</h2><p>Our IPTV service includes 50+ Nepali channels, 80+ Hindi channels, 40+ English channels, Sports channels, and Kids channels.</p><h2>Special Offer</h2><p>Get a 5G router for only Rs. 1,000 additional with any combo plan.</p>`,
        tags: ['IPTV', 'combo package', 'HD TV', 'entertainment', 'Itahari TV service'],
        featuredImage: 'https://images.unsplash.com/photo-1574694238031-813a5b75e5d5?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 412,
        likes: 35,
        sortOrder: 4
      },
      {
        title: '5 Tips to Boost Your Internet Speed at Home',
        slug: '5-tips-boost-internet-speed-home',
        category: 'tips',
        excerpt: 'Is your internet feeling slow? Try these 5 simple tips to maximize your Sajha Net connection speed and get the performance you pay for.',
        content: `<h2>Getting the Most Out of Your Connection</h2><p>You have invested in a high-speed Sajha Net fiber connection. Here are five tips to ensure you are getting every Mbps you are paying for.</p><h2>1. Restart Your Router Regularly</h2><p>Unplug your router for 30 seconds, then plug it back in. Do this once a week for optimal performance.</p><h2>2. Use 5GHz WiFi Band</h2><p>Most modern routers broadcast on two frequencies. Connect to 5GHz when close to the router for maximum speed.</p><h2>3. Reduce Connected Devices</h2><p>Every device connected to your WiFi uses bandwidth. Disconnect devices not currently in use.</p><h2>4. Use Ethernet for Critical Devices</h2><p>For the fastest, most stable connection, connect your work computer or gaming console directly via Ethernet cable.</p><h2>5. Check for Interference</h2><p>WiFi signals can be weakened by thick concrete walls, metal objects, microwave ovens, and neighboring WiFi networks.</p>`,
        tags: ['internet speed', 'WiFi tips', 'network optimization', 'slow internet', 'fiber tips'],
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 298,
        likes: 22,
        sortOrder: 5
      },
      {
        title: 'Top 5 Benefits of Fiber Internet for Students in Itahari',
        slug: 'top-5-benefits-fiber-internet-students-itahari',
        category: 'general',
        excerpt: 'From online classes to research projects, discover why fiber internet from Sajha Net is essential for students in Itahari.',
        content: `<h2>Empowering Students with Reliable Internet</h2><p>In today's digital age, internet access is no longer a luxury — it is a necessity for students.</p><h2>1. Seamless Online Classes</h2><p>Fiber internet provides consistent speeds for uninterrupted video lectures and low latency for real-time participation.</p><h2>2. Access to Online Learning Platforms</h2><p>Students in Itahari now access global educational resources: YouTube tutorials, online courses from Coursera and Khan Academy, research databases, and e-books.</p><h2>3. Reliable Video Calls</h2><p>Crystal clear video calls with teachers and classmates, no more freezing during presentations, and screen sharing for collaborative projects.</p><h2>4. Cloud-Based Productivity</h2><p>Google Workspace, Microsoft 365, Google Drive, Notion, and Trello are used daily by modern students.</p><h2>5. Affordable Plans for Students</h2><p>Bronze Plan (80 Mbps) at just Rs. 6,500/month — perfect for individual students. No deposit required, free router and installation.</p>`,
        tags: ['student internet', 'online education', 'Itahari students', 'fiber for students', 'academic internet'],
        featuredImage: 'https://images.unsplash.com/photo-1523040333635-83785dc02b3c?w=1200&q=80',
        author: admin?._id,
        isPublished: true,
        views: 224,
        likes: 18,
        sortOrder: 6
      }
    ]);

    res.json({ success: true, message: 'Database reseeded successfully!' });
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
