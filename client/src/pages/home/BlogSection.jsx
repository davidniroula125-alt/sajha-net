import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { blogAPI } from '../../services/api';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    blogAPI.getAll().then(({ data }) => {
      setPosts((data.blogs || []).slice(0, 3));
    }).catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <Section className="bg-gray-50 dark:bg-gray-800/50">
      <div className="flex justify-between items-end mb-12">
        <SectionTitle title="Latest <span class='gradient-text'>Blog Posts</span>" subtitle="Stay updated with news, tips, and guides" center={false} />
        <Link to="/blog" className="hidden md:flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold">
          <span>View All</span>
          <FiArrowRight className="w-5 h-5" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={`/blog/${post.slug}`} className="card group block overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
                {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-primary-300 dark:text-primary-600">SN</span>}
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-primary-500 uppercase">{post.category || 'Blog'}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-primary-500 transition-colors">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt || post.content?.substring(0, 120)}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt || post.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
