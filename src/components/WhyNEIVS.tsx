import React from 'react';
import { Navigation, BookOpen, MousePointer, Eye, Play } from 'lucide-react';

const WhyNEIVS: React.FC = () => {
  const features = [
    {
      icon: Navigation,
      title: 'Navigate',
      description: 'Clean tours of complex models',
      color: 'bg-blue-500',
      delay: '0ms'
    },
    {
      icon: BookOpen,
      title: 'Explain',
      description: 'Visuals that reveal the math',
      color: 'bg-green-500',
      delay: '100ms'
    },
    {
      icon: MousePointer,
      title: 'Interact',
      description: 'What-if experiments in seconds',
      color: 'bg-purple-500',
      delay: '200ms'
    },
    {
      icon: Eye,
      title: 'Visualize',
      description: 'Attention, embeddings, and more',
      color: 'bg-orange-500',
      delay: '300ms'
    },
    {
      icon: Play,
      title: 'Simulate',
      description: 'Safe sandboxes for lessons',
      color: 'bg-red-500',
      delay: '400ms'
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why NEI-VS?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five core principles that make AI education accessible, engaging, and effective for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group text-center transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Trusted in workshops and classrooms worldwide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyNEIVS;