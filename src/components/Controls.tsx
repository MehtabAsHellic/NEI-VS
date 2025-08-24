/**
 * LLM Sandbox control panel
 */

import React from 'react';
import { Play, Pause, RotateCcw, Download, Shuffle, ChevronDown } from 'lucide-react';
import { useLLMStore } from '../store/useLLMStore';

const DEMO_PRESETS = [
  'The quick brown fox jumps over the lazy dog.',
  'Transformers learn to pay attention to the right tokens.',
  'NEI-VS: Navigate • Explain • Interact • Visualize • Simulate.',
];

interface ControlsProps {
  onRun: () => void;
  onStep: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onExport: () => void;
  onReseed: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onRun,
  onStep,
  onPlay,
  onPause,
  onReset,
  onExport,
  onReseed,
}) => {
  const {
    prompt,
    setPrompt,
    seqLen,
    setSeqLen,
    temperature,
    setTemperature,
    topK,
    setTopK,
    layerView,
    setLayerView,
    headView,
    setHeadView,
    maskIndex,
    setMaskIndex,
    hyper,
    isRunning,
    isPlaying,
    artifacts,
  } = useLLMStore();

  const [showPresets, setShowPresets] = React.useState(false);

  const tokenOptions = artifacts?.tokens.map((tokenId, index) => ({
    value: index,
    label: `${index}: ${artifacts.tokens[index]}`,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Text</h3>
        
        {/* Preset Dropdown */}
        <div className="relative mb-3">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>Demo Presets</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
          </button>
          
          {showPresets && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {DEMO_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(preset);
                    setShowPresets(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={128}
        />
        <div className="text-xs text-gray-500 mt-1">
          {prompt.length}/128 characters
        </div>
      </div>

      {/* Model Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Controls</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sequence Length: {seqLen}
            </label>
            <input
              type="range"
              min="16"
              max="128"
              value={seqLen}
              onChange={(e) => setSeqLen(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {temperature}
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top-K: {topK}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualization</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layer: {layerView}
            </label>
            <select
              value={layerView}
              onChange={(e) => setLayerView(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: hyper.n_layer }, (_, i) => (
                <option key={i} value={i}>Layer {i}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Head: {headView}
            </label>
            <select
              value={headView}
              onChange={(e) => setHeadView(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: hyper.n_head }, (_, i) => (
                <option key={i} value={i}>Head {i}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mask Token
            </label>
            <select
              value={maskIndex ?? ''}
              onChange={(e) => setMaskIndex(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
              {tokenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>{isRunning ? 'Running...' : 'Run Forward Pass'}</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!artifacts}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button
              onClick={onStep}
              disabled={!artifacts}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Play className="h-4 w-4" />
              <span>Step</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={onReseed}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Shuffle className="h-4 w-4" />
              <span>Re-seed</span>
            </button>
            
            <button
              onClick={onExport}
              disabled={!artifacts}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;