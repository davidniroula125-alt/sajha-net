import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { Section, SectionTitle, Input, Select } from '../components/common/UIComponents';
import { blogAPI } from '../services/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        const { data } = await blogAPI.getAll(params);
        setPosts(data.blogs);
      } catch {
        setPosts([]);
      }
    };
    fetchBlogs();
  }, [category, search]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'tips', label: 'Tips' },
    { value: 'technology', label: 'Technology' },
    { value: 'offers', label: 'Offers' },
    { value: 'fiber-guide', label: 'Fiber Guide' },
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & <span className="text-primary-400">News</span></h1>
            <p className="text-xl text-white/70">Stay updated with the latest news, tips, and guides from Sajha Net.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="w-full md:w-64">
            <Select options={categories} value={category} onChange={e => setCategory(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/blog/${post.slug}`} className="card group block h-full">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
                  <span className="text-4xl font-bold gradient-text opacity-30">SN</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-primary-500 uppercase">{post.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-primary-500 transition-colors">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center"><FiUser className="w-4 h-4 mr-1" />{post.author?.name || 'Sajha Net'}</div>
                    <div className="flex items-center"><FiCalendar className="w-4 h-4 mr-1" />{new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
