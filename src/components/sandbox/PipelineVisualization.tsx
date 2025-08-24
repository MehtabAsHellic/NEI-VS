/**
 * Main pipeline visualization component showing LLM processing steps
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Layers, 
  Eye, 
  Cpu, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Info
} from 'lucide-react';
import { useSandboxStore } from '../../store/useSandboxStore';
import TokenizationStep from './steps/TokenizationStep';
import EmbeddingsStep from './steps/EmbeddingsStep';
import AttentionStep from './steps/AttentionStep';
import ProcessingStep from './steps/ProcessingStep';
import ProbabilitiesStep from './steps/ProbabilitiesStep';
import OutputStep from './steps/OutputStep';

const PIPELINE_STEPS = [
  {
    id: 'tokenization',
    title: 'Tokenization',
    description: 'Breaking text into tokens',
    icon: Type,
    color: 'blue',
    component: TokenizationStep
  },
  {
    id: 'embeddings',
    title: 'Embeddings',
    description: 'Converting to vectors',
    icon: Layers,
    color: 'purple',
    component: EmbeddingsStep
  },
  {
    id: 'attention',
    title: 'Attention',
    description: 'Finding relationships',
    icon: Eye,
    color: 'green',
    component: AttentionStep
  },
  {
    id: 'processing',
    title: 'Neural Layers',
    description: 'Deep processing',
    icon: Cpu,
    color: 'orange',
    component: ProcessingStep
  },
  {
    id: 'probabilities',
    title: 'Probabilities',
    description: 'Calculating next tokens',
    icon: BarChart3,
    color: 'red',
    component: ProbabilitiesStep
  },
  {
    id: 'output',
    title: 'Output',
    description: 'Generated response',
    icon: MessageSquare,
    color: 'indigo',
    component: OutputStep
  }
] as const;

const PipelineVisualization: React.FC = () => {
  const {
    isProcessing,
    currentStep,
    processingPhase,
    activeVisualization,
    setActiveVisualization,
    showExplanations,
    setShowExplanations,
    response,
    runFromStep
  } = useSandboxStore();

  const activeStepData = PIPELINE_STEPS.find(step => step.id === activeVisualization);
  const ActiveComponent = activeStepData?.component;

  const handleStepClick = (stepId: typeof activeVisualization) => {
    if (!isProcessing) {
      runFromStep(stepId);
    } else {
      setActiveVisualization(stepId);
    }
  };
  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <motion.div
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">LLM Processing Pipeline</h2>
          
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showExplanations 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="text-sm">Explanations</span>
          </button>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {PIPELINE_STEPS.map((step, index) => {
            const isActive = activeVisualization === step.id;
            const isCompleted = isProcessing && currentStep > index;
            const isCurrent = processingPhase === step.id;
            const isClickable = !isProcessing || isCompleted || isCurrent;
            
            return (
              <motion.button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isActive
                    ? `border-${step.color}-500 bg-${step.color}-50`
                    : isCompleted
                    ? 'border-green-300 bg-green-50'
                    : isCurrent
                    ? `border-${step.color}-300 bg-${step.color}-25 animate-pulse`
                    : isClickable
                    ? 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
                whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.98 }}
                disabled={!isClickable}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <step.icon className={`h-5 w-5 ${
                    isActive || isCompleted || isCurrent
                      ? `text-${step.color}-600`
                      : 'text-gray-400'
                  }`} />
                  <span className={`font-medium text-sm ${
                    isActive || isCompleted || isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                
                <p className={`text-xs ${
                  isActive || isCompleted || isCurrent
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  {step.description}
                </p>

                {/* Progress indicator */}
                {isCurrent && (
                  <motion.div
                    className={`absolute -inset-0.5 bg-${step.color}-400 rounded-xl opacity-30 -z-10`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Completion checkmark */}
                {isCompleted && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
                
                {/* Click hint */}
                {isClickable && !isProcessing && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to run from here
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Flow Arrows */}
        <div className="hidden lg:flex items-center justify-between px-8 -mt-3 mb-6">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="flex items-center"
              animate={{
                opacity: currentStep > i ? 1 : 0.3,
                x: processingPhase === PIPELINE_STEPS[i]?.id ? [0, 5, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: processingPhase === PIPELINE_STEPS[i]?.id ? Infinity : 0 }}
            >
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Active Step Visualization */}
      <motion.div
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {ActiveComponent && (
            <motion.div
              key={activeVisualization}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Explanations Panel */}
      <AnimatePresence>
        {showExplanations && activeStepData && (
          <motion.div
            className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-3">
              <activeStepData.icon className={`h-6 w-6 text-${activeStepData.color}-600 mt-1 flex-shrink-0`} />
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                  {activeStepData.title} Explained
                </h3>
                <div className="text-sm text-indigo-800 space-y-2">
                  {getStepExplanation(activeStepData.id)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getStepExplanation(stepId: string) {
  const explanations = {
    tokenization: (
      <>
        <p><strong>What happens:</strong> Your text is broken down into smaller pieces called "tokens" - these can be words, parts of words, or even individual characters.</p>
        <p><strong>Why it matters:</strong> AI models can't understand raw text, so we need to convert it into a format they can process. Each token gets a unique number ID.</p>
        <p><strong>Fun fact:</strong> The word "tokenization" itself might be split into ["token", "ization"] or ["tok", "en", "ization"] depending on the model!</p>
      </>
    ),
    embeddings: (
      <>
        <p><strong>What happens:</strong> Each token is converted into a high-dimensional vector (typically 768 or 1024 numbers) that captures its meaning and relationships.</p>
        <p><strong>Why it matters:</strong> Similar words end up with similar vectors. "King" and "Queen" will be close together, as will "Cat" and "Dog".</p>
        <p><strong>Visualization:</strong> We project these high-dimensional vectors down to 2D so you can see how tokens cluster by meaning.</p>
      </>
    ),
    attention: (
      <>
        <p><strong>What happens:</strong> The model figures out which tokens should "pay attention" to which other tokens. This is the secret sauce of transformers!</p>
        <p><strong>Why it matters:</strong> In "The cat sat on the mat", the model learns that "cat" and "sat" are related, even though they're not next to each other.</p>
        <p><strong>Multiple heads:</strong> The model has many "attention heads" that focus on different types of relationships simultaneously.</p>
      </>
    ),
    processing: (
      <>
        <p><strong>What happens:</strong> The token representations flow through multiple neural network layers, each one refining and transforming the information.</p>
        <p><strong>Why it matters:</strong> Each layer builds more complex understanding. Early layers might recognize grammar, while later layers understand meaning and context.</p>
        <p><strong>Scale:</strong> Large models like GPT-4 have dozens of layers and billions of parameters working together.</p>
      </>
    ),
    probabilities: (
      <>
        <p><strong>What happens:</strong> The model calculates the probability of every possible next token (word/piece) that could come next in the sequence.</p>
        <p><strong>Temperature control:</strong> Lower temperature makes the model more confident and predictable. Higher temperature adds creativity and randomness.</p>
        <p><strong>Top-K sampling:</strong> Instead of always picking the most likely token, we randomly sample from the top K most likely options.</p>
      </>
    ),
    output: (
      <>
        <p><strong>What happens:</strong> The model selects the next token based on the probability distribution, adds it to the sequence, and repeats the process.</p>
        <p><strong>Autoregressive generation:</strong> Each new token becomes part of the input for generating the next token, creating coherent text.</p>
        <p><strong>Stopping:</strong> Generation continues until the model produces a special "end" token or reaches a maximum length.</p>
      </>
    )
  };

  return explanations[stepId as keyof typeof explanations] || <p>Explanation coming soon...</p>;
}

export default PipelineVisualization;