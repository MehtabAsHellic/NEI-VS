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
    reset,
    validateParameters
  } = useSandboxStore();

  const runSequentialProcessing = async () => {
    // Validate parameters before processing
    const validation = validateParameters();
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    reset();
    setIsProcessing(true);
    setError(null);

    try {
      const steps = ['tokenization', 'embeddings', 'attention', 'processing', 'probabilities', 'output'] as const;
      setAnimationQueue([...steps]);
      
      // Calculate realistic timing based on mathematical complexity
      const tokenCount = Math.min(prompt.split(/\s+/).filter(t => t.length > 0).length, 512);
      const baseDelay = Math.max(800, tokenCount * 10); // Scale with sequence length
      
      // Step 1-5: Run transformer internals with mathematically-timed animations
      for (let i = 0; i < steps.length; i++) {
        setProcessingPhase(steps[i]);
        setActiveVisualization(steps[i]);
        setCurrentStep(i);
        
        if (i === 0) {
          // Initialize transformer with realistic hyperparameters
          const hyper = {
            d_model: 768,    // Standard embedding dimension
            n_head: 16,      // Multi-head attention
            d_head: 48,      // 768/16 = 48 per head
            n_layer: 24,     // Deep transformer
            seqLen: Math.min(tokenCount, 512), // Sequence length constraint
            ffn_mult: 4,     // FFN expansion factor (768 → 3072 → 768)
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
        
        // Realistic processing delays based on computational complexity
        const stepDelays = {
          tokenization: baseDelay * 0.1,    // Fast: O(n)
          embeddings: baseDelay * 0.2,      // Medium: O(nd)
          attention: baseDelay * 0.4,       // Slow: O(n²d)
          processing: baseDelay * 0.5,      // Slowest: O(nd²) × L layers
          probabilities: baseDelay * 0.15,  // Fast: O(d|V|)
          output: baseDelay * 0.25          // Medium: depends on generation length
        };
        
        await new Promise(resolve => setTimeout(resolve, stepDelays[steps[i]] || baseDelay * 0.3));
      }

      // Final step: Generate response with external LLM
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

  const validation = validateParameters();
  const isDisabled = !validation.isValid || isProcessing;

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
        title={isDisabled && !isProcessing ? validation.errors[0] : undefined}
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
          {isProcessing ? 
            `${processingPhase.charAt(0).toUpperCase() + processingPhase.slice(1)}...` : 
            'Run Transformer Forward Pass'
          }
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
      
      {/* Validation Error Display */}
      {!validation.isValid && !isProcessing && (
        <motion.div
          className="mt-2 text-xs text-red-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {validation.errors[0]}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RunButton;