/**
 * Main LLM Sandbox component
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, BarChart3, Eye, Layers, Target, GitBranch, Sparkles, Zap, Info } from 'lucide-react';
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
  const [showExplanation, setShowExplanation] = React.useState(false);

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

  const tabConfig = [
    { 
      id: 'attention', 
      label: 'Attention', 
      icon: Eye, 
      description: 'See how tokens attend to each other',
      color: 'blue'
    },
    { 
      id: 'embeddings', 
      label: 'Embeddings', 
      icon: Layers, 
      description: '768D vectors projected to 2D space',
      color: 'purple'
    },
    { 
      id: 'probabilities', 
      label: 'Probabilities', 
      icon: BarChart3, 
      description: 'Next token prediction confidence',
      color: 'green'
    },
    { 
      id: 'tokens', 
      label: 'Token Trace', 
      icon: GitBranch, 
      description: 'Step-by-step token processing',
      color: 'orange'
    },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/30 to-purple-50 py-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Neural Network Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          {Array.from({ length: 20 }, (_, i) => (
            <g key={i}>
              <circle
                cx={Math.random() * 1000}
                cy={Math.random() * 1000}
                r="2"
                fill="currentColor"
                className="text-indigo-600"
              />
              {Array.from({ length: 3 }, (_, j) => (
                <line
                  key={j}
                  x1={Math.random() * 1000}
                  y1={Math.random() * 1000}
                  x2={Math.random() * 1000}
                  y2={Math.random() * 1000}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-indigo-400"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">LLM Transformer Sandbox</h1>
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
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center space-x-1"
            >
              <Info className="h-4 w-4" />
              <span>How it Works</span>
            </button>
            <div className="text-sm text-gray-500">
              Navigate • Explain • Interact • Visualize • Simulate
            </div>
          </div>
          
          {/* Explanation Panel */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>How Transformers Work</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-800">
                  <div>
                    <p className="mb-2">
                      <strong>1. Tokenization:</strong> Text is split into tokens (words/subwords)
                    </p>
                    <p className="mb-2">
                      <strong>2. Embeddings:</strong> Tokens become dense vectors capturing meaning
                    </p>
                    <p>
                      <strong>3. Attention:</strong> Tokens "attend" to each other for context
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      <strong>4. Processing:</strong> Multiple layers refine understanding
                    </p>
                    <p className="mb-2">
                      <strong>5. Probabilities:</strong> Model predicts next token likelihood
                    </p>
                    <p>
                      <strong>6. Generation:</strong> Sample from probabilities for output
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              className="bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-4 mb-6 shadow-lg"
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: isRunning ? 360 : 0 }}
                    transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
                  >
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </motion.div>
                  <span>Live Visualization</span>
                </h2>
                
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
              className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-xl"
              whileHover={{ boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                {tabConfig.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all group ${
                      activeTab === tab.id 
                        ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-md` 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    title={tab.description}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        className={`absolute -bottom-4 left-0 right-0 h-0.5 bg-${tab.color}-600 rounded-full`}
                        layoutId="activeTab"
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                      />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {tab.description}
                    </div>
                  </motion.button>
                ))}
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
                    className="flex flex-col items-center justify-center h-96 text-gray-500"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <Target className="h-16 w-16 mx-auto text-indigo-400" />
                      </motion.div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">Ready to Explore</p>
                        <p className="text-gray-500">Run the forward pass to see visualizations</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <span>Input</span>
                        <motion.div 
                          className="w-2 h-2 bg-indigo-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <span>Tokenize</span>
                        <motion.div 
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <span>Embed</span>
                        <motion.div 
                          className="w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                        <span>Attention</span>
                        <motion.div 
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                        />
                        <span>Output</span>
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
                          initial={{ scale: 0.9, opacity: 0 }}
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
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-sm text-blue-800 border border-blue-200"
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
                          initial={{ scale: 0.9, opacity: 0 }}
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
                          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 text-sm text-purple-800 border border-purple-200"
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
                          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-sm text-green-800 border border-green-200"
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
                          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 text-sm text-orange-800 border border-orange-200"
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
              className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Made for NEI-VS — Interactive LLM Learning</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
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