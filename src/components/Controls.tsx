/**
 * LLM Sandbox control panel
 */

import React from 'react';
import { motion } from 'framer-motion';
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
      <motion.div 
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Input Text</span>
        </h3>
        
        {/* Preset Dropdown */}
        <div className="relative mb-3">
          <motion.button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Demo Presets</span>
            <motion.div
              animate={{ rotate: showPresets ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {showPresets && (
              <motion.div 
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
              {DEMO_PRESETS.map((preset, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    setPrompt(preset);
                    setShowPresets(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                >
                  {preset}
                </motion.button>
              ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text here... (e.g., 'The quick brown fox jumps over the lazy dog.')"
          className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={128}
          whileFocus={{ scale: 1.02 }}
        />
        <div className="text-xs text-gray-500 mt-1">
          {prompt.length}/128 characters
        </div>
      </motion.div>

      {/* Model Controls */}
      <motion.div 
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Model Controls</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sequence Length: {seqLen}
            </label>
            <motion.input
              type="range"
              min="16"
              max="128"
              value={seqLen}
              onChange={(e) => setSeqLen(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg appearance-none cursor-pointer slider focus:ring-2 focus:ring-blue-500"
              whileHover={{ scale: 1.02 }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {temperature}
            </label>
            <motion.input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-300 rounded-lg appearance-none cursor-pointer slider focus:ring-2 focus:ring-orange-500"
              whileHover={{ scale: 1.02 }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top-K: {topK}
            </label>
            <motion.input
              type="range"
              min="1"
              max="20"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-300 rounded-lg appearance-none cursor-pointer slider focus:ring-2 focus:ring-green-500"
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Visualization Controls */}
      <motion.div 
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Visualization</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layer: {layerView}
            </label>
            <motion.select
              value={layerView}
              onChange={(e) => setLayerView(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              whileFocus={{ scale: 1.02 }}
            >
              {Array.from({ length: hyper.n_layer }, (_, i) => (
                <option key={i} value={i}>Layer {i}</option>
              ))}
            </motion.select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Head: {headView}
            </label>
            <motion.select
              value={headView}
              onChange={(e) => setHeadView(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              whileFocus={{ scale: 1.02 }}
            >
              {Array.from({ length: hyper.n_head }, (_, i) => (
                <option key={i} value={i}>Head {i}</option>
              ))}
            </motion.select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mask Token
            </label>
            <motion.select
              value={maskIndex ?? ''}
              onChange={(e) => setMaskIndex(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">None</option>
              {tokenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Actions</span>
        </h3>
        
        <div className="space-y-3">
          <motion.button
            onClick={onRun}
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg"
            whileHover={{ scale: isRunning ? 1 : 1.02, y: isRunning ? 0 : -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: isRunning ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0, ease: "linear" }}
            >
              <Play className="h-4 w-4" />
            </motion.div>
            <span>{isRunning ? 'Running...' : 'Run Forward Pass'}</span>
          </motion.button>
          
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!artifacts}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-1 shadow-md"
              whileHover={{ scale: artifacts ? 1.05 : 1, y: artifacts ? -2 : 0 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </motion.button>
            
            <motion.button
              onClick={onStep}
              disabled={!artifacts}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-1 shadow-md"
              whileHover={{ scale: artifacts ? 1.05 : 1, y: artifacts ? -2 : 0 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-4 w-4" />
              <span>Step</span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              onClick={onReset}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-1 shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </motion.button>
            
            <motion.button
              onClick={onReseed}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-1 shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle className="h-4 w-4" />
              <span>Re-seed</span>
            </motion.button>
            
            <motion.button
              onClick={onExport}
              disabled={!artifacts}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-1 shadow-md"
              whileHover={{ scale: artifacts ? 1.05 : 1, y: artifacts ? -2 : 0 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Controls;