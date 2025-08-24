/**
 * Main LLM Sandbox component
 */

import React, { useRef, useEffect } from 'react';
import { Activity, TrendingUp, BarChart3, Eye, Layers, Target, GitBranch } from 'lucide-react';
import { useLLMStore } from '../store/useLLMStore';
import Controls from './Controls';
import Heatmap from './Heatmap';
import ProbBar from './ProbBar';
import EmbeddingProjector from './EmbeddingProjector';
import TokenTrace from './TokenTrace';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Transformer Sandbox</h1>
          <p className="text-gray-600">
            Explore how transformers work through interactive visualizations and step-by-step execution.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div>
            <Controls
              onRun={runForwardPass}
              onStep={handleStep}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onExport={handleExport}
              onReseed={handleReseed}
            />
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2">
            {/* Status Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Live Visualization</h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Activity className={`h-4 w-4 ${isRunning ? 'text-green-500' : 'text-gray-400'}`} />
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
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <div className="text-red-800">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            {/* Main Visualization Panel */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {/* Tab Navigation */}
              <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setActiveTab('attention')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'attention' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>Attention</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('embeddings')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'embeddings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Embeddings</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('probabilities')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'probabilities' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Probabilities</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'tokens' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Token Trace</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {!artifacts ? (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <div className="text-center">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Run the forward pass to see visualizations</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'attention' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Attention Heatmap</h3>
                          <div className="text-sm text-gray-600">
                            Layer {layerView} • Head {headView}
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Heatmap
                            attention={currentAttention}
                            tokens={artifacts.tokens}
                            width={400}
                            height={400}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'embeddings' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Embedding Projector</h3>
                        <div className="flex justify-center">
                          <EmbeddingProjector
                            embeddings={artifacts.embeddings}
                            tokens={artifacts.tokens}
                            width={500}
                            height={400}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'probabilities' && (
                      <div className="space-y-4">
                        <ProbBar
                          logits={artifacts.lastLogits}
                          temperature={temperature}
                          topK={topK}
                        />
                      </div>
                    )}

                    {activeTab === 'tokens' && (
                      <div className="space-y-4">
                        <TokenTrace
                          tokens={artifacts.tokens}
                          currentStep={isPlaying ? stepIndex : undefined}
                          onTokenHover={setHoveredToken}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Made for NEI-VS — LLM math demo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMSandbox;