/**
 * Main LLM Sandbox component
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, BarChart3, Eye, Layers, Target, GitBranch } from 'lucide-react';
import { useLLMStore } from '../store/useLLMStore';
import Controls from './Controls';
import Heatmap from './Heatmap';
import ProbBar from './ProbBar';
import EmbeddingProjector from './EmbeddingProjector';
import TokenTrace from './TokenTrace';
import OnboardingTour from './OnboardingTour';
import type { ForwardRequest } from '../lib/worker';

const LLMSandbox: React.FC = () => {
  const workerRef = useRef<Worker | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    prompt,
    seqLen,
    temperature,
    topK,
    layerView,
    headView,
    maskIndex,
    seed,
    hyper,
    isRunning,
    isPlaying,
    stepIndex,
    artifacts,
    error,
    setIsRunning,
    setIsPlaying,
    setStepIndex,
    setArtifacts,
    setError,
    setSeed,
    reset,
  } = useLLMStore();

  const [activeTab, setActiveTab] = React.useState('attention');
  const [hoveredToken, setHoveredToken] = React.useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [isFirstRun, setIsFirstRun] = React.useState(true);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../lib/worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const result = e.data;
      if (result.error) {
        setError(result.error);
      } else {
        setArtifacts(result);
        setError(null);
      }
      setIsRunning(false);
    };

    return () => {
      workerRef.current?.terminate();
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [setArtifacts, setError, setIsRunning]);

  const runForwardPass = () => {
    if (!workerRef.current || isRunning) return;

    if (isFirstRun) {
      setIsFirstRun(false);
    }

    setIsRunning(true);
    setError(null);

    const request: ForwardRequest = {
      text: prompt,
      seqLen,
      temperature,
      topK,
      layerView,
      headView,
      maskIndex,
      seed,
      hyper,
    };

    workerRef.current.postMessage(request);
  };

  const handleStep = () => {
    if (!artifacts) return;
    setStepIndex(Math.min(stepIndex + 1, artifacts.tokens.length - 1));
  };

  const handlePlay = () => {
    if (!artifacts) return;
    
    setIsPlaying(true);
    playIntervalRef.current = setInterval(() => {
      setStepIndex(prev => {
        const next = prev + 1;
        if (next >= artifacts.tokens.length) {
          setIsPlaying(false);
          if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
          }
          return prev;
        }
        return next;
      });
    }, 300);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  const handleReset = () => {
    reset();
    setStepIndex(0);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  const handleExport = () => {
    if (!artifacts) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      prompt,
      hyperparameters: hyper,
      seed,
      tokens: artifacts.tokens,
      embeddings: artifacts.embeddings.map(emb => 
        emb.map(val => Math.round(val * 10000) / 10000)
      ),
      attention: artifacts.attnByLayerHead.map(layer =>
        layer.map(head =>
          head.map(row => row.map(val => Math.round(val * 10000) / 10000))
        )
      ),
      logits: artifacts.lastLogits.map(val => Math.round(val * 10000) / 10000),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nei-vs-llm-session.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReseed = () => {
    setSeed(Math.floor(Math.random() * 10000));
  };

  const currentAttention = artifacts?.attnByLayerHead[layerView]?.[headView] || [];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Transformer Sandbox</h1>
          <p className="text-gray-600">
            Explore how transformers work through interactive visualizations and step-by-step execution.
          </p>
          
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Take a Tour
            </button>
            <div className="text-sm text-gray-500">
              Navigate • Explain • Interact • Visualize • Simulate
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Controls
              onRun={runForwardPass}
              onStep={handleStep}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onExport={handleExport}
              onReseed={handleReseed}
            />
          </motion.div>

          {/* Right Column - Visualization */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Status Bar */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm"
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Live Visualization</h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <motion.div
                      animate={{ scale: isRunning ? [1, 1.2, 1] : 1 }}
                      transition={{ repeat: isRunning ? Infinity : 0, duration: 1 }}
                    >
                      <Activity className={`h-4 w-4 ${isRunning ? 'text-green-500' : 'text-gray-400'}`} />
                    </motion.div>
                    <span>Demo Mode</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>Loss: n/a</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span>Acc: n/a</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-red-800">
                  <strong>Error:</strong> {error}
                </div>
              </motion.div>
            )}

            {/* Main Visualization Panel */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg"
              whileHover={{ boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Tab Navigation */}
              <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 pb-4">
                <motion.button
                  onClick={() => setActiveTab('attention')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'attention' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Attention</span>
                  {activeTab === 'attention' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('embeddings')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'embeddings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layers className="h-4 w-4" />
                  <span>Embeddings</span>
                  {activeTab === 'embeddings' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('probabilities')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'probabilities' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Probabilities</span>
                  {activeTab === 'probabilities' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setActiveTab('tokens')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'tokens' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Token Trace</span>
                  {activeTab === 'tokens' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  className="min-h-[400px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                {!artifacts ? (
                  <motion.div 
                    className="flex items-center justify-center h-96 text-gray-500"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      </motion.div>
                      <p>Run the forward pass to see visualizations</p>
                      <div className="mt-4 text-sm text-gray-400">
                        Input → Tokenize → Embed → Attention → Output
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {activeTab === 'attention' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Attention Heatmap</h3>
                          <div className="text-sm text-gray-600">
                            Layer {layerView} • Head {headView}
                          </div>
                        </div>
                        
                        <motion.div 
                          className="flex justify-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <Heatmap
                            attention={currentAttention}
                            tokens={artifacts.tokens}
                            width={400}
                            height={400}
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <strong>How to read:</strong> Darker blue cells show stronger attention. 
                          Each row represents a query token attending to key tokens (columns).
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 'embeddings' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">Embedding Projector</h3>
                        <motion.div 
                          className="flex justify-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <EmbeddingProjector
                            embeddings={artifacts.embeddings}
                            tokens={artifacts.tokens}
                            width={500}
                            height={400}
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <strong>768D → 2D Projection:</strong> Similar tokens cluster together. 
                          Colors represent token types (letters, digits, punctuation).
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 'probabilities' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <ProbBar
                          logits={artifacts.lastLogits}
                          temperature={temperature}
                          topK={topK}
                        />
                        
                        <motion.div 
                          className="bg-green-50 rounded-lg p-4 text-sm text-green-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <strong>Next Token Prediction:</strong> Higher temperature = more creative/random. 
                          Lower temperature = more deterministic/focused.
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 'tokens' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <TokenTrace
                          tokens={artifacts.tokens}
                          currentStep={isPlaying ? stepIndex : undefined}
                          onTokenHover={setHoveredToken}
                        />
                        
                        <motion.div 
                          className="bg-orange-50 rounded-lg p-4 text-sm text-orange-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <strong>Token Sequence:</strong> Blue highlight shows current processing step. 
                          Special tokens like &lt;bos&gt; and &lt;eos&gt; mark sequence boundaries.
                        </motion.div>
                      </motion.div>
                    )}
                  </>
                )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="mt-6 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Made for NEI-VS — LLM math demo
            </motion.div>
          </motion.div>
        </div>
        
        {/* Onboarding Tour */}
        <OnboardingTour 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
        />
      </div>
    </motion.div>
  );
};

export default LLMSandbox;