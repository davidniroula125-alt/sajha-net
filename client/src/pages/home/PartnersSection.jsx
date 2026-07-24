import React from 'react';
import { motion } from 'framer-motion';
import { Section, SectionTitle } from '../../components/common/UIComponents';

export default function PartnersSection() {
  const partners = [
    'Nepal Telecom', 'NTA', 'WorldLink', 'Vianet', 'Classic Tech',
    'CG Net', 'DishHome', 'Subisu', 'Mercantile', 'Sunrise'
  ];

  return (
    <Section>
      <SectionTitle title="Our <span class='gradient-text'>Partners</span>" subtitle="Trusted technology and infrastructure partners" />
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((partner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="w-32 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{partner}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
