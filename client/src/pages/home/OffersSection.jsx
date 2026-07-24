import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPercent, FiGift } from 'react-icons/fi';
import { Section, SectionTitle, Badge } from '../../components/common/UIComponents';
import { offerAPI } from '../../services/api';

export default function OffersSection() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    offerAPI.getAll().then(({ data }) => setOffers(data.offers || [])).catch(() => setOffers([]));
  }, []);

  if (offers.length === 0) return null;

  return (
    <Section>
      <SectionTitle title="Current <span class='gradient-text'>Offers</span>" subtitle="Don't miss out on our latest deals and promotions" />
      <div className="grid md:grid-cols-3 gap-6">
        {offers.map((offer, i) => (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <Badge variant="success" className="mb-4">
                <FiClock className="w-3 h-3 mr-1 inline" />
                Limited Time
              </Badge>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{offer.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{offer.description}</p>
              <div className="flex items-center justify-between">
                {offer.discount > 0 && (
                  <div className="flex items-center space-x-2">
                    <FiPercent className="w-4 h-4 text-success-500" />
                    <span className="text-success-500 font-bold">{offer.discount}% OFF</span>
                  </div>
                )}
                {offer.code && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono">
                    {offer.code}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
