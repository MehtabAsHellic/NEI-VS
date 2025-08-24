/**
 * Next-token probability bar chart component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getTokenChar } from '../lib/tokenizer';
import { softmax } from '../lib/linalg';

interface ProbBarProps {
  logits: number[];
  temperature: number;
  topK: number;
}

const ProbBar: React.FC<ProbBarProps> = ({ logits, temperature, topK }) => {
  // Apply temperature and get probabilities
  const probs = softmax(logits, temperature);
  
  // Get top-k tokens
  const topTokens = probs
    .map((prob, id) => ({ id, prob, char: getTokenChar(id) }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, topK);

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Next Token Probabilities</h4>
      
      <div className="space-y-2">
        {topTokens.map((token, i) => (
          <motion.div 
            key={token.id} 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <div className="w-12 text-sm font-mono text-gray-700">
              {token.char}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
              <motion.div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${token.prob * 100}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="w-12 text-xs text-gray-600 text-right">
              {(token.prob * 100).toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="text-xs text-gray-500 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Temperature: {temperature} • Top-{topK} tokens
      </motion.div>
    </div>
  );
};

export default ProbBar;