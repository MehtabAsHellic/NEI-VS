import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, BookOpen, MousePointer, Eye, Play, Zap } from 'lucide-react';

const LandingFeatures: React.FC = () => {
  const features = [
    {
      icon: Navigation,
      title: 'Navigate',
      description: 'Guided tours through complex AI model internals with step-by-step explanations.',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    {
      icon: BookOpen,
      title: 'Explain',
      description: 'Clear visual breakdowns of LLM processes, from tokenization to generation.',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      delay: '100ms'
    },
    {
      icon: MousePointer,
      title: 'Interact',
      description: 'Tweak prompts, adjust parameters, and see real-time changes in model behavior.',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      delay: '200ms'
    },
    {
      icon: Eye,
      title: 'Visualize',
      description: 'See attention patterns, embeddings, and neural activations in beautiful charts.',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      delay: '300ms'
    },
    {
      icon: Play,
      title: 'Simulate',
      description: 'Run safe experiments in controlled sandbox environments.',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      delay: '400ms'
    },
    {
      icon: Zap,
      title: 'Accelerate',
      description: 'Fast-track your AI understanding with hands-on learning experiences.',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      delay: '500ms'
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose NEI-VS?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Six core principles that make AI education accessible, engaging, and effective for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 5 }}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </motion.div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Trusted by educators and students worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingFeatures;