import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', size = 'md', to, href, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105';
  const variants = {
    primary: 'gradient-bg text-white hover:shadow-xl shadow-lg',
    secondary: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;
  return <button className={classes} {...props}>{children}</button>;
};

export const Card = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -5, scale: 1.02 } : {}}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>{children}</span>;
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <input className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${className}`} {...props} />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <select className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${className}`} {...props}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none ${className}`} {...props} />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export const Loading = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
};

export const Section = ({ children, className = '', id }) => (
  <section id={id} className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

export const SectionTitle = ({ title, subtitle, center = true, className = '' }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: title }} />
    {subtitle && <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);
