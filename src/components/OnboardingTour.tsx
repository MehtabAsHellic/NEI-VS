/**
 * Onboarding tour component for the LLM Sandbox
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Navigation, BookOpen, MousePointer, Eye, Play } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to the LLM Sandbox!',
    description: 'Learn how transformers work through interactive visualizations. This tour will guide you through the key features.',
    icon: Navigation,
    position: 'center',
  },
  {
    id: 'input',
    title: 'Input Your Text',
    description: 'Start by entering text or selecting a demo preset. This text will be tokenized and processed by the transformer.',
    icon: BookOpen,
    position: 'left',
    target: 'input-section',
  },
  {
    id: 'controls',
    title: 'Adjust Model Parameters',
    description: 'Control sequence length, temperature, and other hyperparameters to see how they affect the model\'s behavior.',
    icon: MousePointer,
    position: 'left',
    target: 'model-controls',
  },
  {
    id: 'run',
    title: 'Run the Forward Pass',
    description: 'Click "Run Forward Pass" to process your text through the transformer and generate visualizations.',
    icon: Play,
    position: 'left',
    target: 'run-button',
  },
  {
    id: 'visualizations',
    title: 'Explore Visualizations',
    description: 'Switch between attention heatmaps, embeddings, probabilities, and token traces to understand how the model works.',
    icon: Eye,
    position: 'right',
    target: 'visualization-tabs',
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  const step = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Tour Modal */}
          <motion.div
            className={`fixed z-50 ${
              step.position === 'center' 
                ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                : step.position === 'left'
                ? 'top-1/2 left-8 transform -translate-y-1/2'
                : 'top-1/2 right-8 transform -translate-y-1/2'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <div className="text-xs text-gray-500">
                      Step {currentStep + 1} of {tourSteps.length}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {currentStep > 0 && (
                    <motion.button
                      onClick={prevStep}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-sm">Back</span>
                    </motion.button>
                  )}
                  
                  <button
                    onClick={skipTour}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
                  >
                    Skip Tour
                  </button>
                </div>

                <motion.button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">
                    {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Spotlight Effect */}
          {step.target && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse" />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;