/**
 * Attention mechanism visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const AttentionStep: React.FC = () => {
  const { prompt, transformerResults, processingPhase } = useSandboxStore();

  const tokens = React.useMemo(() => {
    if (transformerResults?.processingSteps.tokenization) {
      return transformerResults.processingSteps.tokenization.tokenStrings.slice(0, 8);
    }
    if (!prompt) return [];
    return prompt.split(/\s+/).filter(t => t.length > 0).slice(0, 8);
  }, [prompt, transformerResults]);

  // Generate mock attention weights
  const attentionMatrix = React.useMemo(() => {
    if (transformerResults?.processingSteps.attention.matrices?.[0]?.[0]) {
      // Use real attention data if available
      const realMatrix = transformerResults.processingSteps.attention.matrices[0][0];
      const size = Math.min(tokens.length, realMatrix.length);
      return realMatrix.slice(0, size).map(row => row.slice(0, size));
    }
    
    if (!tokens.length) return [];
    
    return tokens.map((_, i) => 
      tokens.map((_, j) => {
        // Create realistic attention patterns
        const distance = Math.abs(i - j);
        const baseAttention = Math.exp(-distance * 0.3) + Math.random() * 0.2;
        return Math.max(0.1, Math.min(1, baseAttention));
      })
    );
  }, [tokens, transformerResults]);

  const [selectedToken, setSelectedToken] = React.useState<number | null>(null);
  const isCurrentlyProcessing = processingPhase === 'attention';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Eye className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">Attention Mechanism</h3>
        <div className="text-sm text-gray-600">
          Multi-head self-attention
        </div>
        {isCurrentlyProcessing && (
          <motion.div
            className="w-2 h-2 bg-green-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {prompt && tokens.length > 0 ? (
        <>
          {/* Token Selection */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Click a token to see what it pays attention to:
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedToken(index)}
                  className={`px-3 py-2 rounded-lg border font-mono text-sm transition-all ${
                    selectedToken === index
                      ? 'bg-green-600 text-white border-green-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isCurrentlyProcessing ? index * 0.1 : 0 }}
                >
                  {token}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Attention Heatmap */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Attention Heatmap</h4>
            
            <div className="space-y-2">
              {/* Column headers */}
              <div className="flex">
                <div className="w-20"></div>
                {tokens.map((token, index) => (
                  <div key={index} className="flex-1 text-center text-xs font-medium text-gray-600 p-1">
                    {token}
                  </div>
                ))}
              </div>
              
              {/* Attention matrix */}
              {attentionMatrix.map((row, i) => (
                <motion.div
                  key={i}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isCurrentlyProcessing ? i * 0.1 : 0 }}
                >
                  <div className="w-20 text-xs font-medium text-gray-600 text-right pr-2">
                    {tokens[i]}
                  </div>
                  {row.map((attention, j) => (
                    <motion.div
                      key={j}
                      className="flex-1 aspect-square m-0.5 rounded cursor-pointer relative"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${attention})`,
                        border: selectedToken === i ? '2px solid #16a34a' : '1px solid #e5e7eb'
                      }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      title={`${tokens[i]} → ${tokens[j]}: ${(attention * 100).toFixed(1)}%`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: isCurrentlyProcessing ? (i * tokens.length + j) * 0.02 : 0 }}
                    >
                      {attention > 0.7 && (
                        <motion.div
                          className="absolute inset-0 bg-white rounded opacity-30"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>Darker = Higher Attention</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>Low</span>
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Attention Flow Visualization */}
          {selectedToken !== null && (
            <motion.div
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>"{tokens[selectedToken]}" pays attention to:</span>
              </h4>
              
              <div className="space-y-2">
                {attentionMatrix[selectedToken]
                  ?.map((attention, index) => ({ token: tokens[index], attention, index }))
                  .sort((a, b) => b.attention - a.attention)
                  .slice(0, 5)
                  .map((item, rank) => (
                    <motion.div
                      key={item.index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.1 }}
                    >
                      <div className="w-16 text-sm font-mono text-gray-700">
                        {item.token}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          className="bg-green-600 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.attention * 100}%` }}
                          transition={{ delay: rank * 0.1 + 0.2, duration: 0.5 }}
                        />
                      </div>
                      <div className="w-12 text-xs text-gray-600 text-right">
                        {(item.attention * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Multi-head Attention Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">16</div>
                {transformerResults?.processingSteps.attention.heads || 16}
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">24</div>
                {transformerResults?.processingSteps.attention.layers || 24}
            </div>
            
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {tokens.length}²
              </div>
              <div className="text-xs text-teal-700">Connections</div>
            </div>
          </div>

          {/* Processing Animation */}
          {isCurrentlyProcessing && (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Eye className="h-5 w-5 text-green-600" />
                </motion.div>
                <span className="text-sm text-gray-600">Computing attention patterns...</span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see attention patterns</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttentionStep;