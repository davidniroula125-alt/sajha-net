const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Package = require('../models/Package');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const Coverage = require('../models/Coverage');
const Hero = require('../models/Hero');
const Banner = require('../models/Banner');
const Employee = require('../models/Employee');
const Announcement = require('../models/Announcement');
const TeamMember = require('../models/TeamMember');
const Gallery = require('../models/Gallery');
const Notice = require('../models/Notice');
const Setting = require('../models/Setting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sajhanet');
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany();
    await Package.deleteMany();
    await Service.deleteMany();
    await FAQ.deleteMany();
    await Testimonial.deleteMany();
    await Coverage.deleteMany();
    await Hero.deleteMany();
    await Banner.deleteMany();
    await Employee.deleteMany();
    await Announcement.deleteMany();
    await TeamMember.deleteMany();
    await Gallery.deleteMany();
    await Notice.deleteMany();
    await Setting.deleteMany();

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sajhanet.com',
      password: 'Sajha@Admin2026',
      role: 'admin',
      phone: '+977-9801234567'
    });

    const customer = await User.create({
      name: 'Ram Shrestha',
      email: 'ram@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+977-9841234567',
      address: { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '1' }
    });

const packages = await Package.insertMany([
      { name: 'Bronze', slug: 'bronze', speed: 80, type: 'internet', billingCycle: 'yearly', price: 6500, prices: { yearly: 6500, halfYearly: 3250, quarterly: 1625, monthly: 542 }, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Browsing', 'Social Media', 'Light Streaming'], highlights: ['No Deposit', 'Free Router', 'Free Drop Wire'], isPopular: false, isRecommended: false, sortOrder: 1, description: 'Bronze package — 80 Mbps fiber internet for light to moderate usage.', shortDescription: '80 Mbps Fiber Internet', seo: { title: 'Bronze Package — 80 Mbps Internet at Rs. 6,500/year | Sajha Net', description: 'Bronze package with 80 Mbps fiber internet, no deposit required, free router and drop wire included.', keywords: ['bronze package', '80 Mbps internet', 'Rs 6500 yearly', 'Sajha Net Bronze'] } },
      { name: 'Silver', slug: 'silver', speed: 100, type: 'internet', billingCycle: 'yearly', price: 7500, prices: { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 }, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family', 'Streaming', 'HD Video'], highlights: ['No Deposit', 'Free Router', 'Fast Speed'], isPopular: true, isRecommended: false, sortOrder: 2, description: 'Silver package — 100 Mbps fiber internet for families and moderate heavy users.', shortDescription: '100 Mbps Fiber Internet', seo: { title: 'Silver Package — 100 Mbps Internet at Rs. 7,500/year | Sajha Net', description: 'Silver package with 100 Mbps fiber internet, no deposit required, free router and drop wire included.', keywords: ['silver package', '100 Mbps internet', 'Rs 7500 yearly', 'Sajha Net Silver'] } },
      { name: 'Gold', slug: 'gold', speed: 150, type: 'internet', billingCycle: 'yearly', price: 8500, prices: { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 }, installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Multiple Devices', 'HD Streaming', 'Gaming'], highlights: ['No Deposit', 'Free Router', 'High Speed'], isPopular: false, isRecommended: true, sortOrder: 3, description: 'Gold package — 150 Mbps fiber internet for power users.', shortDescription: '150 Mbps Fiber Internet', seo: { title: 'Gold Package — 150 Mbps Internet at Rs. 8,500/year | Sajha Net', description: 'Gold package with 150 Mbps fiber internet, no deposit required, free router and drop wire included.', keywords: ['gold package', '150 Mbps internet', 'Rs 8500 yearly', 'Sajha Net Gold'] } },
      { name: 'Platinum', slug: 'platinum', speed: 200, type: 'internet', billingCycle: 'yearly', price: 9500, prices: { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 }, installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation', 'High-Speed Fiber Network'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Power Users', '4K Streaming', 'Multiple Users'], highlights: ['No Deposit', 'Free Router', 'Premium Speed'], isPopular: false, isRecommended: true, sortOrder: 4, description: 'Platinum package — 200 Mbps fiber internet for power users.', shortDescription: '200 Mbps Fiber Internet', seo: { title: 'Platinum Package — 200 Mbps Internet at Rs. 9,500/year | Sajha Net', description: 'Platinum package with 200 Mbps fiber internet, no deposit required, free router and drop wire included.', keywords: ['platinum package', '200 Mbps internet', 'Rs 9500 yearly', 'Sajha Net Platinum'] } },
      { name: 'Essential', slug: 'essential', speed: 80, type: 'combo', billingCycle: 'yearly', price: 8500, prices: { yearly: 8500, halfYearly: 4250, quarterly: 2125, monthly: 708 }, installationCharge: 0, image: '', badge: '', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Entertainment', 'Family', 'TV + Internet'], highlights: ['Internet + IPTV', 'No Deposit', 'Free Router'], isPopular: false, isRecommended: false, sortOrder: 5, description: 'Essential combo package — 80 Mbps internet + IP TV.', shortDescription: '80 Mbps + IP TV Bundle', seo: { title: 'Essential Package — 80 Mbps Internet + IP TV at Rs. 8,500/year | Sajha Net', description: 'Essential combo package with 80 Mbps internet and IPTV, no deposit required, free router and drop wire included.', keywords: ['essential package', '80 Mbps + IPTV', 'Rs 8500 yearly', 'internet TV bundle'] } },
      { name: 'Enhanced', slug: 'enhanced', speed: 150, type: 'combo', billingCycle: 'yearly', price: 9500, prices: { yearly: 9500, halfYearly: 4750, quarterly: 2375, monthly: 792 }, installationCharge: 0, image: '', badge: 'Popular', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Family Entertainment', 'HD Streaming + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'High Speed'], isPopular: true, isRecommended: false, sortOrder: 6, description: 'Enhanced combo package — 150 Mbps internet + IP TV.', shortDescription: '150 Mbps + IP TV Bundle', seo: { title: 'Enhanced Package — 150 Mbps Internet + IP TV at Rs. 9,500/year | Sajha Net', description: 'Enhanced combo package with 150 Mbps internet and IPTV, no deposit required, free router and drop wire included.', keywords: ['enhanced package', '150 Mbps + IPTV', 'Rs 9500 yearly', 'internet TV bundle'] } },
      { name: 'Premium', slug: 'premium', speed: 200, type: 'combo', billingCycle: 'yearly', price: 10500, prices: { yearly: 10500, halfYearly: 5250, quarterly: 2625, monthly: 875 }, installationCharge: 0, image: '', badge: 'Recommended', features: ['Unlimited Internet', 'IP TV Included', 'No Deposit Required', 'FREE WiFi Router', 'FREE Drop Wire', 'Fiber Connection', '24/7 Customer Support', 'Professional Installation'], includes: { router: true, mesh: false, tv: true, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Ultimate Bundle', 'Power Users', '4K + TV'], highlights: ['Internet + IPTV', 'No Deposit', 'Ultimate Speed'], isPopular: false, isRecommended: true, sortOrder: 7, description: 'Premium combo package — 200 Mbps internet + IP TV.', shortDescription: '200 Mbps + IP TV Bundle', seo: { title: 'Premium Package — 200 Mbps Internet + IP TV at Rs. 10,500/year | Sajha Net', description: 'Premium combo package with 200 Mbps internet and IPTV, no deposit required, free router and drop wire included.', keywords: ['premium package', '200 Mbps + IPTV', 'Rs 10500 yearly', 'ultimate internet TV bundle'] } },
      { name: 'Business Starter', slug: 'business-starter', speed: 100, type: 'business', billingCycle: 'yearly', price: 7500, prices: { yearly: 7500, halfYearly: 3750, quarterly: 1875, monthly: 625 }, installationCharge: 0, image: '', badge: '', features: ['100 Mbps Dedicated', 'Fiber Connection', '99.9% Uptime SLA', '24x7 Priority Support', 'Static IP', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: false, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Small Business', 'Startups'], highlights: ['SLA Guarantee', 'Priority Support', 'Static IP'], isPopular: false, isRecommended: false, sortOrder: 8, description: 'Business Starter package — 100 Mbps dedicated fiber internet.', shortDescription: '100 Mbps Business Internet', seo: { title: 'Business Starter Package — 100 Mbps Dedicated Internet at Rs. 7,500/year | Sajha Net', description: 'Business Starter with 100 Mbps dedicated fiber, SLA guarantee, static IP, and priority support.', keywords: ['business starter', '100 Mbps business', 'Rs 7500 yearly', 'SLA guarantee'] } },
      { name: 'Business Pro', slug: 'business-pro', speed: 300, type: 'business', billingCycle: 'yearly', price: 15000, prices: { yearly: 15000, halfYearly: 7500, quarterly: 3750, monthly: 1250 }, installationCharge: 0, image: '', badge: '', features: ['300 Mbps Dedicated', 'Fiber Connection', '99.99% Uptime SLA', '24x7 Priority Support', 'Static IP', 'Managed WiFi', 'FREE Router', 'FREE Drop Wire'], includes: { router: true, mesh: true, tv: false, phone: false, ott: [], unlimitedData: true, dropWire: true, fairUsagePolicy: '' }, idealFor: ['Growing Business', 'Offices'], highlights: ['Enterprise SLA', 'Managed WiFi', 'Dedicated Support'], isPopular: false, isRecommended: true, sortOrder: 9, description: 'Business Pro package — 300 Mbps dedicated fiber internet.', shortDescription: '300 Mbps Business Internet', seo: { title: 'Business Pro Package — 300 Mbps Dedicated Internet at Rs. 15,000/year | Sajha Net', description: 'Business Pro with 300 Mbps dedicated fiber, enterprise SLA, static IP, managed WiFi, and 24/7 priority support.', keywords: ['business pro', '300 Mbps business', 'Rs 15000 yearly', 'enterprise SLA'] } }
    ]);

    const services = await Service.insertMany([
      { name: 'Fiber Internet', slug: 'fiber-internet', description: 'High-speed fiber optic internet for homes and businesses.', shortDescription: 'Ultra-fast fiber connectivity', icon: 'FaWifi', features: ['Speeds up to 1 Gbps', '99.9% Uptime', 'Unlimited Data', 'Free Router'], category: 'internet', sortOrder: 1 },
      { name: 'Business Internet', slug: 'business-internet', description: 'Dedicated internet solutions for businesses with SLA guarantees.', shortDescription: 'Enterprise-grade connectivity', icon: 'FaBuilding', features: ['Dedicated Bandwidth', 'Static IP', 'SLA Guarantee', '24/7 Support'], category: 'business', sortOrder: 2 },
      { name: 'NetTV', slug: 'nettv', description: 'IPTV service with 200+ channels including HD and 4K.', shortDescription: 'Premium IPTV service', icon: 'FaTv', features: ['200+ Channels', 'HD & 4K Content', 'Catch-up TV', 'Multi-screen'], category: 'entertainment', sortOrder: 3 },
      { name: 'Mesh WiFi', slug: 'mesh-wifi', description: 'Whole-home WiFi coverage with mesh technology.', shortDescription: 'Seamless home coverage', icon: 'FaHome', features: ['Whole-home Coverage', 'Easy Setup', 'Parental Controls', 'Guest Network'], category: 'addons', sortOrder: 4 },
      { name: 'Cloud Services', slug: 'cloud-services', description: 'Cloud storage and computing solutions.', shortDescription: 'Cloud infrastructure', icon: 'FaCloud', features: ['Cloud Storage', 'Backup Solutions', 'Scalable Resources', 'Data Security'], category: 'enterprise', sortOrder: 5 },
      { name: 'Web Hosting', slug: 'web-hosting', description: 'Reliable web hosting with 99.9% uptime.', shortDescription: 'Fast & reliable hosting', icon: 'FaServer', features: ['99.9% Uptime', 'Free SSL', 'cPanel Access', '24/7 Support'], category: 'services', sortOrder: 6 },
      { name: 'VPN Services', slug: 'vpn-services', description: 'Secure VPN for business and personal use.', shortDescription: 'Secure connectivity', icon: 'FaShieldAlt', features: ['Encrypted Connection', 'Remote Access', 'Multiple Protocols', 'No Logs'], category: 'enterprise', sortOrder: 7 },
      { name: 'CCTV Networking', slug: 'cctv-networking', description: 'Professional CCTV installation and networking.', shortDescription: 'Security solutions', icon: 'FaVideo', features: ['HD Cameras', 'Remote Monitoring', 'Night Vision', 'Cloud Storage'], category: 'services', sortOrder: 8 }
    ]);

    const faqs = await FAQ.insertMany([
      { question: 'How do I apply for a new connection?', answer: 'You can apply online through our website or visit your nearest Sajha Net office. Fill out the application form and our team will contact you within 24 hours.', category: 'installation', sortOrder: 1 },
      { question: 'What is the installation process?', answer: 'After application approval, our technical team will visit your location for fiber installation. The process typically takes 1-3 days depending on your area.', category: 'installation', sortOrder: 2 },
      { question: 'What speeds are available?', answer: 'We offer speeds from 50 Mbps to 1 Gbps. Choose the plan that best fits your needs. You can upgrade or downgrade anytime.', category: 'packages', sortOrder: 3 },
      { question: 'Is there a data limit?', answer: 'No, all our plans come with unlimited data. We believe in fair and transparent internet access.', category: 'packages', sortOrder: 4 },
      { question: 'How do I pay my bill?', answer: 'You can pay through eSewa, Khalti, bank transfer, or visit our office for cash payment. Online payment is available 24/7.', category: 'billing', sortOrder: 5 },
      { question: 'What should I do if my internet is slow?', answer: 'First, restart your router. If the issue persists, check our troubleshooting guide or contact our support team at 9705390890.', category: 'technical', sortOrder: 6 },
      { question: 'How do I report a complaint?', answer: 'You can submit a complaint through our support page, call us at 9705390890, or use our live chat feature.', category: 'support', sortOrder: 7 },
      { question: 'What is the minimum contract period?', answer: 'We offer both monthly and annual plans. Annual plans come with significant discounts. There is no lock-in period for monthly plans.', category: 'billing', sortOrder: 8 }
    ]);

    const testimonials = await Testimonial.insertMany([
      { name: 'Aarav Sharma', location: 'Itahari', rating: 5, content: 'Best ISP in Nepal! Super fast speeds and excellent customer support. Highly recommended!', package: '100 Mbps', isFeatured: true, sortOrder: 1 },
      { name: 'Priya Thapa', location: 'Lalitpur', rating: 5, content: 'Switched from another ISP and the difference is night and day. Stable connection even during peak hours.', package: '200 Mbps', isFeatured: true, sortOrder: 2 },
      { name: 'Bikash Gurung', location: 'Pokhara', rating: 4, content: 'Great service for the price. Installation was quick and the team was professional.', package: '50 Mbps', isFeatured: true, sortOrder: 3 },
      { name: 'Sita Maharjan', location: 'Bhaktapur', rating: 5, content: 'Perfect for streaming and gaming. No more buffering! The mesh WiFi covers our entire home.', package: '300 Mbps', isFeatured: false, sortOrder: 4 },
      { name: 'Rajan Das', location: 'Chitwan', rating: 5, content: 'As a business owner, I need reliable internet. Sajha Net delivers 99.99% uptime as promised.', package: 'Business 600 Mbps', isFeatured: true, sortOrder: 5 }
    ]);

    const coverages = await Coverage.insertMany([
      { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '1', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
      { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '5', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
      { province: 'Koshi', district: 'Terhathum', municipality: 'Itahari', ward: '10', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
      { province: 'Bagmati', district: 'Lalitpur', municipality: 'Lalitpur Metropolitan', ward: '1', estimatedSpeed: 'Up to 1 Gbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
      { province: 'Bagmati', district: 'Bhaktapur', municipality: 'Bhaktapur Municipality', ward: '1', estimatedSpeed: 'Up to 600 Mbps', servicesAvailable: ['Fiber', 'TV'] },
      { province: 'Gandaki', district: 'Kaski', municipality: 'Pokhara Metropolitan', ward: '1', estimatedSpeed: 'Up to 500 Mbps', servicesAvailable: ['Fiber', 'TV', 'Phone'] },
      { province: 'Lumbini', district: 'Rupandehi', municipality: 'Bhairahawa', ward: '1', estimatedSpeed: 'Up to 300 Mbps', servicesAvailable: ['Fiber', 'TV'] },
      { province: 'Koshi', district: 'Jhapa', municipality: 'Birtamod', ward: '1', estimatedSpeed: 'Up to 200 Mbps', servicesAvailable: ['Fiber'] }
    ]);

    // New CMS seed data
    await Hero.create({
      title: 'Super Fast Fiber Internet & HD TV',
      subtitle: 'No Deposit Required! FREE Router + Drop Wire Included with Every Plan!',
      badge: "Connect at the speed of life",
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
      { title: 'Super Fast Fiber Internet & HD TV', description: 'Internet + IP TV combo plans starting at NPR 8,500/year. IP TV Service FREE with 5G Router for only NPR 1,000!', type: 'promo', position: 'homepage', isActive: true, sortOrder: 2 },
      { title: 'Get Connected Today!', description: 'Call us at 9705390890 or visit our office. Quick installation within 24-48 hours.', type: 'promo', position: 'homepage', isActive: true, sortOrder: 3 }
    ]);

    await Employee.insertMany([
      { name: 'Suresh Adhikari', email: 'suresh@sajhanet2025@gmail.com', phone: '+977-9801111111', department: 'Technical', role: 'admin', position: 'CTO', isActive: true },
      { name: 'Maya Tamang', email: 'maya@sajhanet2025@gmail.com', phone: '+977-9802222222', department: 'Support', role: 'support', position: 'Support Manager', isActive: true },
      { name: 'Ramesh Karki', email: 'ramesh@sajhanet2025@gmail.com', phone: '+977-9803333333', department: 'Sales', role: 'sales', position: 'Sales Executive', isActive: true }
    ]);

    await Announcement.insertMany([
      { title: 'Scheduled Maintenance', content: 'We will be performing maintenance on our network infrastructure on Saturday night from 2 AM to 5 AM. Internet services may be briefly interrupted.', type: 'maintenance', isPopup: false, isActive: true },
      { title: 'Festival Season Offer', content: 'Celebrate Dashain with 25% off on all new connections! Offer valid till October 31st.', type: 'offer', isPopup: true, isActive: true }
    ]);

    await TeamMember.insertMany([
      { name: 'Rajesh Gurung', position: 'CEO & Founder', department: 'Executive', bio: 'Visionary leader with 15+ years in telecom industry.', email: 'rajesh@sajhanet2025@gmail.com', sortOrder: 1, isActive: true },
      { name: 'Anita Sharma', position: 'Head of Operations', department: 'Operations', bio: 'Expert in network operations and infrastructure.', email: 'anita@sajhanet2025@gmail.com', sortOrder: 2, isActive: true },
      { name: 'Deepak Magar', position: 'Head of Sales', department: 'Sales', bio: 'Driving business growth through strategic partnerships.', email: 'deepak@sajhanet2025@gmail.com', sortOrder: 3, isActive: true }
    ]);

    await Gallery.insertMany([
      { title: 'Office Headquarters', image: '', category: 'office', description: 'Our modern office in Itahari', sortOrder: 1 },
      { title: 'Network Operations Center', image: '', category: 'infrastructure', description: '24/7 NOC monitoring', sortOrder: 2 },
      { title: 'Team Building Event', image: '', category: 'events', description: 'Annual team outing 2024', sortOrder: 3 }
    ]);

    await Notice.insertMany([
      { title: 'New Coverage Area', content: 'We have expanded our network to cover new areas in Lalitpur. Check our coverage page for details.', type: 'update', isActive: true },
      { title: 'Speed Upgrade Program', content: 'Existing customers can now upgrade their speeds at discounted rates. Contact support for details.', type: 'notice', isActive: true }
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
      { key: 'copyrightText', value: `© ${new Date().getFullYear()} Sajha Net Pvt. Ltd. All rights reserved.`, category: 'footer' },
      { key: 'tagline', value: 'Connect at the speed of life', category: 'general' }
    ]);

    console.log('Seed data created successfully!');
    console.log('Admin credentials: admin@sajhanet.com / Sajha@Admin2026');
    console.log('Customer credentials: ram@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
