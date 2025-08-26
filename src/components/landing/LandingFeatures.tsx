import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, BookOpen, MousePointer, Eye, Play } from 'lucide-react';

const LandingFeatures: React.FC = () => {
  const principles = [
    {
      icon: Navigation,
      title: 'Navigate',
      description: 'Guided tours',
      color: 'indigo'
    },
    {
      icon: BookOpen,
      title: 'Explain',
      description: 'Clear breakdowns',
      color: 'blue'
    },
    {
      icon: MousePointer,
      title: 'Interact',
      description: 'Hands-on experiments',
      color: 'purple'
    },
    {
      icon: Eye,
      title: 'Visualize',
      description: 'Dynamic representations',
      color: 'green'
    },
    {
      icon: Play,
      title: 'Simulate',
      description: 'Real-time simulations',
      color: 'orange'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Why NEI-VS?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Five principles that make AI education accessible and engaging.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className={`w-16 h-16 bg-${principle.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${principle.color}-200 transition-colors duration-200`}>
                <principle.icon className={`h-8 w-8 text-${principle.color}-600`} />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {principle.title}
              </h3>
              
              <p className="text-slate-600 text-sm">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;