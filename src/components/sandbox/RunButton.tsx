/**
 * Main run inference button component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Loader } from 'lucide-react';
import { useSandboxStore } from '../../store/useSandboxStore';
import { generateWithGemini } from '../../lib/gemini';
import { forward, initWeights } from '../../lib/tiny-transformer';

const RunButton: React.FC = () => {
  const {
    prompt,
    temperature,
    topK,
    isProcessing,
    processingPhase,
    setIsProcessing,
    setCurrentStep,
    setProcessingPhase,
    setResponse,
    setTransformerResults,
    setError,
    setActiveVisualization,
    setAnimationQueue,
    reset
  } = useSandboxStore();

  const runSequentialProcessing = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    reset();
    setIsProcessing(true);
    setError(null);

    try {
      const steps = ['tokenization', 'embeddings', 'attention', 'processing', 'probabilities', 'output'] as const;
      setAnimationQueue([...steps]);
      
      // Step 1-5: Run transformer internals with animations
      for (let i = 0; i < steps.length; i++) {
        setProcessingPhase(steps[i]);
        setActiveVisualization(steps[i]);
        setCurrentStep(i);
        
        if (i === 0) {
          // Initialize transformer on first step
          const hyper = {
            d_model: 64,
            n_head: 4,
            d_head: 16,
            n_layer: 2,
            seqLen: 64,
            ffn_mult: 2,
          };
          
          const weights = initWeights(hyper, 1337);
          const results = forward(prompt, hyper, weights, {
            temperature,
            topK,
            layerView: 0,
            headView: 0,
          });
          
          setTransformerResults(results);
        }
        
        // Animation delay for each step
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      // Step 6: Generate final response with Gemini
      setProcessingPhase('output');
      setActiveVisualization('output');
      setCurrentStep(5);
      
      const response = await generateWithGemini(prompt, temperature, topK);
      setResponse(response);
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate response');
    } finally {
      setIsProcessing(false);
      setProcessingPhase('idle');
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
        onClick={runSequentialProcessing}
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
          {isProcessing ? `Processing ${processingPhase}...` : 'Run LLM Inference'}
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