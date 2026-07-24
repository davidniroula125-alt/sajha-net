import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Section, SectionTitle } from '../../components/common/UIComponents';
import { faqAPI } from '../../services/api';

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    faqAPI.getAll().then(({ data }) => setFaqs(data.faqs?.slice(0, 6) || [])).catch(() => setFaqs([]));
  }, []);

  return (
    <Section>
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked <span className="gradient-text">Questions</span></h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Find answers to common questions</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
              {openId === faq._id ? (
                <FiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {openId === faq._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
