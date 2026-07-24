import React from 'react';
import HeroSection from './home/HeroSection';
import OffersSection from './home/OffersSection';
import PackagesSection from './home/PackagesSection';
import ComboSection from './home/ComboSection';
import BusinessSection from './home/BusinessSection';
import WhyChooseSection from './home/WhyChooseSection';
import CoverageSection from './home/CoverageSection';
import TestimonialsSection from './home/TestimonialsSection';
import BlogSection from './home/BlogSection';
import FAQSection from './home/FAQSection';
import CTASection from './home/CTASection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <OffersSection />
      <PackagesSection />
      <ComboSection />
      <BusinessSection />
      <WhyChooseSection />
      <CoverageSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
