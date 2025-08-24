/**
 * Main run inference button component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Loader } from 'lucide-react';
import { useSandboxStore } from '../../store/useSandboxStore';
import { generateWithGemini } from '../../lib/gemini';

const RunButton: React.FC = () => {
  const {
    prompt,
    temperature,
    topK,
    isProcessing,
    setIsProcessing,
    setCurrentStep,
    setResponse,
    setError,
    reset
  } = useSandboxStore();

  const handleRun = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    reset();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate step-by-step processing
      const steps = ['tokenization', 'embeddings', 'attention', 'processing', 'probabilities', 'output'];
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
      }

      // Generate actual response
      const response = await generateWithGemini(prompt, temperature, topK);
      setResponse(response);
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate response');
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = !prompt.trim() || isProcessing;

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <motion.button
        onClick={handleRun}
        disabled={isDisabled}
        className={`
          relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg
          ${isDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl'
          }
        `}
        whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
      >
        {/* Background Animation */}
        {!isDisabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0"
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
          transition={isProcessing ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
        >
          {isProcessing ? (
            <Loader className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </motion.div>

        {/* Text */}
        <span className="relative z-10">
          {isProcessing ? 'Processing...' : 'Run LLM Inference'}
        </span>

        {/* Sparkle Effect */}
        {!isDisabled && !isProcessing && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="h-4 w-4 text-yellow-300" />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default RunButton;