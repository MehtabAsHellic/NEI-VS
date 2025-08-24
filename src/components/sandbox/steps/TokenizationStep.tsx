/**
 * Tokenization visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Type, Hash } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const TokenizationStep: React.FC = () => {
  const { prompt, response, isProcessing } = useSandboxStore();

  // Simulate tokenization for display
  const tokens = React.useMemo(() => {
    if (!prompt) return [];
    
    // Simple tokenization simulation - in reality this would be much more complex
    return prompt
      .split(/(\s+|[.,!?;:])/)
      .filter(token => token.trim().length > 0)
      .map((token, index) => ({
        id: index,
        text: token,
        type: /\s/.test(token) ? 'space' : 
              /[.,!?;:]/.test(token) ? 'punctuation' : 
              /\d/.test(token) ? 'number' : 'word'
      }));
  }, [prompt]);

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'word': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'number': return 'bg-green-100 text-green-800 border-green-200';
      case 'punctuation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'space': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Type className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Tokenization</h3>
        <div className="text-sm text-gray-600">
          {tokens.length} tokens
        </div>
      </div>

      {prompt ? (
        <>
          {/* Original Text */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text:</h4>
            <p className="text-gray-900 font-mono text-sm leading-relaxed">
              "{prompt}"
            </p>
          </div>

          {/* Tokenized Output */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Hash className="h-4 w-4" />
              <span>Tokens:</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, index) => (
                <motion.div
                  key={token.id}
                  className={`px-3 py-2 rounded-lg border font-mono text-sm ${getTokenColor(token.type)}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3,
                    type: "spring",
                    damping: 20
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-medium">
                      {token.text === ' ' ? '␣' : token.text}
                    </span>
                    <span className="text-xs opacity-60">
                      ID: {token.id}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tokens.filter(t => t.type === 'word').length}
              </div>
              <div className="text-xs text-blue-700">Words</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tokens.filter(t => t.type === 'number').length}
              </div>
              <div className="text-xs text-green-700">Numbers</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tokens.filter(t => t.type === 'punctuation').length}
              </div>
              <div className="text-xs text-orange-700">Punctuation</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tokens.length}
              </div>
              <div className="text-xs text-purple-700">Total Tokens</div>
            </div>
          </div>

          {/* Processing Animation */}
          {isProcessing && (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
                <span className="ml-3 text-sm text-gray-600">Processing tokens...</span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <Type className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see tokenization in action</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenizationStep;