import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { testimonialAPI } from '../../services/api';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    testimonialAPI.getAll().then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => setTestimonials([]));
  }, []);

  return (
    <Section>
      <SectionTitle title="What Our <span class='gradient-text'>Customers Say</span>" subtitle="Trusted by thousands of happy customers across Nepal" />
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, j) => (
                <FiStar key={j} className={`w-5 h-5 ${j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{t.content}"</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-gray-500">{t.location} • {t.package}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
