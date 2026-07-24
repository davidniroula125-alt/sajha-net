import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Section } from '../components/common/UIComponents';
import { blogAPI } from '../services/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await blogAPI.getOne(slug);
        setPost(data.blog);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <Section>
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 pb-16">
        <Section>
          <div className="max-w-3xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h2>
            <Link to="/blog" className="text-primary-500 hover:text-primary-600">Back to Blog</Link>
          </div>
        </Section>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <div className="flex items-center"><FiUser className="w-4 h-4 mr-1" />{post.author?.name || 'Sajha Net'}</div>
              <div className="flex items-center"><FiCalendar className="w-4 h-4 mr-1" />{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>

            {post.featuredImage && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.article>
        </div>
      </Section>
    </div>
  );
}