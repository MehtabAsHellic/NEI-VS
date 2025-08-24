/**
 * Next-token probability bar chart component
 */

import React from 'react';
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
          <div key={token.id} className="flex items-center space-x-3">
            <div className="w-12 text-sm font-mono text-gray-700">
              {token.char}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${token.prob * 100}%` }}
              />
            </div>
            <div className="w-12 text-xs text-gray-600 text-right">
              {(token.prob * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Temperature: {temperature} • Top-{topK} tokens
      </div>
    </div>
  );
};

export default ProbBar;