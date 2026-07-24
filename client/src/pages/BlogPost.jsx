import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Section } from '../components/common/UIComponents';

export default function BlogPost() {
  const { slug } = useParams();

  const posts = {
    'fiber-internet-guide': {
      title: 'Complete Guide to Fiber Internet in Nepal',
      category: 'Technology',
      date: '2026-01-15',
      author: 'Sajha Net Team',
      content: `
        <p>Fiber internet is the future of connectivity in Nepal. With speeds up to 1 Gbps, it's transforming how we work, stream, and connect.</p>
        <h2>What is Fiber Internet?</h2>
        <p>Fiber optic internet uses thin strands of glass or plastic to transmit data as light signals. This technology provides much faster speeds and more reliable connections compared to traditional copper or wireless connections.</p>
        <h2>Benefits of Fiber Internet</h2>
        <ul>
          <li>Ultra-fast speeds up to 1 Gbps</li>
          <li>Low latency for gaming and video calls</li>
          <li>Unlimited data with no caps</li>
          <li>99.9% uptime guarantee</li>
          <li>Future-proof technology</li>
        </ul>
        <h2>How to Get Fiber Internet</h2>
        <p>Getting fiber internet is easy with Sajha Net. Simply apply online or visit our nearest office. Our team will install fiber at your location within 24-48 hours.</p>
      `
    },
    'speed-test-tips': {
      title: 'How to Get Maximum Speed from Your Internet',
      category: 'Tips',
      date: '2026-01-10',
      author: 'Sajha Net Team',
      content: `
        <p>Getting the most out of your internet connection requires proper setup and optimization. Here are our top tips.</p>
        <h2>1. Restart Your Router</h2>
        <p>The simplest fix is often the most effective. Restart your router at least once a week to clear cache and refresh connections.</p>
        <h2>2. Use 5GHz WiFi</h2>
        <p>Connect to the 5GHz band for faster speeds and less interference. The 2.4GHz band has better range but slower speeds.</p>
        <h2>3. Update Router Firmware</h2>
        <p>Keep your router's firmware updated for optimal performance and security.</p>
        <h2>4. Use Ethernet Cable</h2>
        <p>For the fastest and most stable connection, use an Ethernet cable instead of WiFi.</p>
      `
    }
  };

  const post = posts[slug] || {
    title: 'Blog Post',
    category: 'General',
    date: '2026-01-01',
    author: 'Sajha Net Team',
    content: '<p>Content coming soon...</p>'
  };

  return (
    <div className="pt-24 pb-16">
      <Section>
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-8">
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-medium text-primary-500 uppercase">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center"><FiUser className="w-4 h-4 mr-1" />{post.author}</div>
              <div className="flex items-center"><FiCalendar className="w-4 h-4 mr-1" />{new Date(post.date).toLocaleDateString()}</div>
            </div>

            <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl mb-8 flex items-center justify-center">
              <span className="text-6xl font-bold gradient-text opacity-30">SN</span>
            </div>

            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.article>
        </div>
      </Section>
    </div>
  );
}
