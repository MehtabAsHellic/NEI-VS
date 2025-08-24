/**
 * Token probability calculation visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Dice6 } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const ProbabilitiesStep: React.FC = () => {
  const { prompt, response, temperature, topK, isProcessing } = useSandboxStore();

  // Generate mock probability distribution
  const probabilities = React.useMemo(() => {
    const commonTokens = [
      'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'that',
      'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I'
    ];
    
    return commonTokens.map((token, index) => ({
      token,
      logit: Math.random() * 10 - 5, // Raw logit score
      probability: 0, // Will be calculated after softmax
      rank: index + 1
    })).sort((a, b) => b.logit - a.logit);
  }, []);

  // Apply softmax with temperature
  const processedProbabilities = React.useMemo(() => {
    const scaledLogits = probabilities.map(p => p.logit / temperature);
    const maxLogit = Math.max(...scaledLogits);
    const expLogits = scaledLogits.map(logit => Math.exp(logit - maxLogit));
    const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
    
    return probabilities.map((prob, index) => ({
      ...prob,
      probability: expLogits[index] / sumExp,
      scaledLogit: scaledLogits[index]
    })).sort((a, b) => b.probability - a.probability);
  }, [probabilities, temperature]);

  const topKProbabilities = processedProbabilities.slice(0, topK);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-6 w-6 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900">Token Probabilities</h3>
        <div className="text-sm text-gray-600">
          Next token prediction
        </div>
      </div>

      {prompt ? (
        <>
          {/* Temperature & Top-K Controls Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Temperature: {temperature}</span>
              </div>
              <div className="text-xs text-gray-600">
                {temperature < 0.5 ? 'More focused and deterministic' :
                 temperature > 1.0 ? 'More creative and random' :
                 'Balanced creativity and focus'}
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(temperature / 2) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Dice6 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Top-K: {topK}</span>
              </div>
              <div className="text-xs text-gray-600">
                Sampling from top {topK} most likely tokens
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(topK / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Top {topK} Token Probabilities
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topKProbabilities.map((item, index) => (
                <motion.div
                  key={item.token}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-6 text-xs text-gray-500 text-center">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 text-sm font-mono text-gray-700">
                    "{item.token}"
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-red-500 to-pink-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.probability * 100}%` }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                    />
                    
                    {/* Probability text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {(item.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="w-16 text-xs text-gray-600 text-right">
                    {item.logit.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sampling Visualization */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sampling Process</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">1. Calculate logits for all tokens</span>
                <span className="text-green-600">✓</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">2. Apply temperature scaling</span>
                <span className="text-green-600">✓</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">3. Convert to probabilities (softmax)</span>
                <span className="text-green-600">✓</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">4. Select top-{topK} candidates</span>
                <span className="text-green-600">✓</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">5. Sample next token</span>
                <motion.span
                  className="text-orange-600"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⏳
                </motion.span>
              </div>
            </div>

            {/* Selected Token */}
            <motion.div
              className="mt-4 p-3 bg-white rounded-lg border-2 border-red-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Selected Token:</div>
                <div className="text-lg font-bold text-red-600">
                  "{topKProbabilities[0]?.token}"
                </div>
                <div className="text-xs text-gray-500">
                  {(topKProbabilities[0]?.probability * 100).toFixed(1)}% probability
                </div>
              </div>
            </motion.div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {topKProbabilities.length}
              </div>
              <div className="text-xs text-red-700">Top Tokens</div>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-pink-600">
                {(topKProbabilities[0]?.probability * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-pink-700">Max Probability</div>
            </div>
            
            <div className="bg-rose-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-rose-600">
                {(topKProbabilities.reduce((sum, p) => sum + p.probability, 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-rose-700">Total Coverage</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {temperature}
              </div>
              <div className="text-xs text-orange-700">Temperature</div>
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
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <BarChart3 className="h-5 w-5 text-red-600" />
                </motion.div>
                <span className="text-sm text-gray-600">Calculating probabilities...</span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see token probabilities</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilitiesStep;