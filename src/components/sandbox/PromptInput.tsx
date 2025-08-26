/**
 * Enhanced prompt input component with presets and controls
 * Implements efficient debouncing and parameter validation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, ChevronDown, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useSandboxStore } from '../../store/useSandboxStore';

const PROMPT_PRESETS = [
  {
    category: 'Educational',
    prompts: [
      'Explain quantum physics in simple terms',
      'How does photosynthesis work?',
      'What causes the seasons to change?',
      'Describe the water cycle step by step',
      'How do neural networks learn patterns?'
    ]
  },
  {
    category: 'Creative',
    prompts: [
      'Write a short story about a robot learning to paint',
      'Create a recipe for happiness',
      'Describe a day in the life of a cloud',
      'Invent a new holiday and explain how to celebrate it',
      'Compose a haiku about artificial intelligence'
    ]
  },
  {
    category: 'Technical',
    prompts: [
      'Explain the difference between AI and machine learning',
      'What is the transformer architecture?',
      'How does natural language processing work?',
      'Describe the attention mechanism in detail',
      'What are the mathematical foundations of backpropagation?'
    ]
  }
];

const PromptInput: React.FC = () => {
  const {
    prompt,
    temperature,
    topK,
    isProcessing,
    setPrompt,
    setTemperature,
    setTopK,
    validateParameters
  } = useSandboxStore();

  const [showPresets, setShowPresets] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(0);
  const [promptValidation, setPromptValidation] = React.useState<{
    isValid: boolean;
    message: string;
    tokenCount: number;
  }>({ isValid: true, message: '', tokenCount: 0 });

  // Debounced prompt validation
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const validation = validateParameters();
      const tokenCount = prompt.trim().split(/\s+/).filter(t => t.length > 0).length;
      
      if (!validation.isValid) {
        setPromptValidation({
          isValid: false,
          message: validation.errors[0] || 'Invalid input',
          tokenCount: 0
        });
      } else {
        const seqLen = Math.min(tokenCount, 512); // Standard transformer limit
        setPromptValidation({
          isValid: true,
          message: `Ready: ${tokenCount} tokens → seq_len=${seqLen}`,
          tokenCount: seqLen
        });
      }
    }, 300); // 300ms debounce for efficiency

    return () => clearTimeout(timeoutId);
  }, [prompt, validateParameters]);

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span>Your Prompt</span>
          </h2>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Powered by Gemini</span>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything... (e.g., 'Explain how rainbows form' or 'Write a poem about space')"
              className={`w-full h-32 px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                promptValidation.isValid 
                  ? 'border-gray-200 focus:ring-indigo-500' 
                  : 'border-red-300 focus:ring-red-500'
              }`}
              disabled={isProcessing}
              maxLength={500}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {promptValidation.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${promptValidation.isValid ? 'text-gray-400' : 'text-red-500'}`}>
                {prompt.length}/500
              </span>
            </div>
          </div>

          {/* Validation Message */}
          <div className={`text-xs flex items-center space-x-1 ${
            promptValidation.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{promptValidation.message}</span>
            {promptValidation.isValid && promptValidation.tokenCount > 0 && (
              <span className="text-gray-500">
                (d=768, max_seq=512)
              </span>
            )}
          </div>
          {/* Preset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all"
              disabled={isProcessing}
            >
              <span>Choose from example prompts</span>
              <motion.div
                animate={{ rotate: showPresets ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            {showPresets && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Category Tabs */}
                <div className="flex border-b border-gray-200">
                  {PROMPT_PRESETS.map((category, index) => (
                    <button
                      key={category.category}
                      onClick={() => setSelectedCategory(index)}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        selectedCategory === index
                          ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {category.category}
                    </button>
                  ))}
                </div>

                {/* Prompts */}
                <div className="max-h-48 overflow-y-auto">
                  {PROMPT_PRESETS[selectedCategory].prompts.map((presetPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPrompt(presetPrompt);
                        setShowPresets(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {presetPrompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls with Mathematical Context */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature T = {temperature}
              <span className="text-xs text-gray-500 ml-1">(softmax scaling)</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
              disabled={isProcessing}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused (T→0)</span>
              <span>Creative (T→∞)</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              p = softmax(z/T)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top-K = {topK}
              <span className="text-xs text-gray-500 ml-1">(truncated sampling)</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-green-200 to-purple-300 rounded-lg appearance-none cursor-pointer slider"
              disabled={isProcessing}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Greedy (K=1)</span>
              <span>Diverse (K=100)</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Keep top K, renormalize
            </div>
          </div>
        </div>

        {/* Mathematical Context */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Zap className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-800">
              <p className="font-medium mb-1">Transformer Forward Pass:</p>
              <p>
                <span className="font-mono text-xs bg-white/60 px-2 py-1 rounded">
                  text → tokens → embeddings → attention → FFN → logits → softmax → sample
                </span>
              </p>
              <p className="text-xs mt-1 text-indigo-600">
                Complexity: O(n²d) attention + O(nd²) FFN per layer × L layers
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptInput;