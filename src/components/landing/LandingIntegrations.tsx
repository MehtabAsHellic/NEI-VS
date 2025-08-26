import React from 'react';
import { motion } from 'framer-motion';

const LandingIntegrations: React.FC = () => {
  const integrations = [
    { name: 'Google Gemini', logo: '🤖' },
    { name: 'Appwrite', logo: '🔐' },
    { name: 'Vercel', logo: '▲' },
    { name: 'React', logo: '⚛️' }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Universities' },
    { value: '4.9★', label: 'User Rating' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Integrations */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-8">
            Powered by industry leaders
          </h3>
          
          <div className="flex items-center justify-center space-x-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                className="flex flex-col items-center space-y-2 grayscale hover:grayscale-0 transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl">{integration.logo}</div>
                <div className="text-sm text-slate-600 font-medium">{integration.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-8">
            Trusted by beginners to pros
          </h3>
          
          <div className="flex items-center justify-center space-x-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingIntegrations;