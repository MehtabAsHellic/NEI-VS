/**
 * Main AI Sandbox component - redesigned for LLM focus
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Info, ExternalLink } from 'lucide-react';
import PromptInput from './sandbox/PromptInput';
import PipelineVisualization from './sandbox/PipelineVisualization';
import RunButton from './sandbox/RunButton';
import { useSandboxStore } from '../store/useSandboxStore';

const AISandbox: React.FC = () => {
  const { error, setError } = useSandboxStore();
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <div id="ai-sandbox" className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Interactive AI Sandbox</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Model Sandbox
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            See inside LLMs: Enter a prompt and watch the magic unfold, powered by Gemini.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>How it works</span>
            </button>
            
            <span className="text-gray-300">•</span>
            
            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <span>Powered by Gemini</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <motion.div
              className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 text-left max-w-4xl mx-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-3">
                <Brain className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                    How Large Language Models Work
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-800">
                    <div className="space-y-2">
                      <p><strong>1. Tokenization:</strong> Your text is broken into tokens (words/subwords)</p>
                      <p><strong>2. Embeddings:</strong> Tokens become high-dimensional vectors</p>
                      <p><strong>3. Attention:</strong> Model finds relationships between tokens</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>4. Processing:</strong> Neural layers refine understanding</p>
                      <p><strong>5. Probabilities:</strong> Calculate next token likelihoods</p>
                      <p><strong>6. Generation:</strong> Sample and generate response text</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <PromptInput />
            <RunButton />
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2">
            <PipelineVisualization />
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Navigate • Explain • Interact • Visualize • Simulate</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AISandbox;