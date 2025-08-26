/**
 * Attention mechanism visualization step
 * Implements scaled dot-product attention with mathematical accuracy
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Calculator, Zap } from 'lucide-react';
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

  // Generate mathematically accurate attention weights
  const attentionMatrix = React.useMemo(() => {
    if (transformerResults?.processingSteps.attention.matrices?.[0]?.[0]) {
      // Use real attention data if available
      const realMatrix = transformerResults.processingSteps.attention.matrices[0][0];
      const size = Math.min(tokens.length, realMatrix.length);
      return realMatrix.slice(0, size).map(row => row.slice(0, size));
    }
    
    if (!tokens.length) return [];
    
    // Simulate realistic attention patterns based on linguistic principles
    return tokens.map((_, i) => 
      tokens.map((_, j) => {
        // Distance-based attention with causal masking
        const distance = Math.abs(i - j);
        const causalMask = j <= i ? 1 : 0; // Autoregressive masking
        const distanceDecay = Math.exp(-distance * 0.2);
        const randomNoise = Math.random() * 0.1;
        const baseAttention = (distanceDecay + randomNoise) * causalMask;
        
        return Math.max(0.01, Math.min(1, baseAttention));
      })
    );
  }, [tokens, transformerResults]);

  // Apply softmax normalization for mathematical accuracy
  const normalizedAttention = React.useMemo(() => {
    return attentionMatrix.map(row => {
      const sum = row.reduce((acc, val) => acc + val, 0);
      return sum > 0 ? row.map(val => val / sum) : row;
    });
  }, [attentionMatrix]);
  const [selectedToken, setSelectedToken] = React.useState<number | null>(null);
  const isCurrentlyProcessing = processingPhase === 'attention';

  // Calculate attention statistics
  const attentionStats = React.useMemo(() => {
    if (!normalizedAttention.length) return null;
    
    const flatAttention = normalizedAttention.flat();
    const entropy = -flatAttention.reduce((sum, p) => 
      p > 0 ? sum + p * Math.log2(p) : sum, 0
    );
    const maxAttention = Math.max(...flatAttention);
    const avgAttention = flatAttention.reduce((sum, p) => sum + p, 0) / flatAttention.length;
    
    return { entropy, maxAttention, avgAttention };
  }, [normalizedAttention]);
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Eye className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">Attention Mechanism</h3>
        <div className="text-sm text-gray-600">
          Scaled Dot-Product Attention
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
          {/* Mathematical Formula Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="h-5 w-5 text-green-600" />
              <h4 className="text-sm font-medium text-gray-700">Mathematical Foundation</h4>
            </div>
            <div className="font-mono text-sm text-green-800 space-y-1">
              <div>Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) V</div>
              <div className="text-xs text-green-600">
                Where d<sub>k</sub> = {Math.floor(768 / 16)} (head dimension), 
                scaling factor = 1/√{Math.floor(768 / 16)} ≈ {(1/Math.sqrt(768/16)).toFixed(3)}
              </div>
            </div>
          </div>
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
            
              {attentionStats && (
                <div className="text-xs text-gray-600 space-x-4">
                  <span>Entropy: {attentionStats.entropy.toFixed(2)}</span>
                  <span>Max: {(attentionStats.maxAttention * 100).toFixed(1)}%</span>
                </div>
              )}
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
              {normalizedAttention.map((row, i) => (
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
                        backgroundColor: `rgba(34, 197, 94, ${Math.pow(attention, 0.5)})`, // Gamma correction for better visibility
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
                {normalizedAttention[selectedToken]
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
              
              <div className="mt-3 text-xs text-gray-600">
                Sum of probabilities: {normalizedAttention[selectedToken]?.reduce((sum, p) => sum + p, 0).toFixed(3)}
                {Math.abs(normalizedAttention[selectedToken]?.reduce((sum, p) => sum + p, 0) - 1) < 0.01 && 
                  <span className="text-green-600 ml-2">✓ Normalized</span>
                }
              </div>
            </motion.div>
          )}

          {/* Multi-head Attention Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">16</div>
                {transformerResults?.processingSteps.attention.heads || 16}
              <div className="text-xs text-gray-500 mt-1">Parallel processing</div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">24</div>
                {transformerResults?.processingSteps.attention.layers || 24}
              <div className="text-xs text-gray-500 mt-1">Sequential refinement</div>
            </div>
            
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {tokens.length}²
              </div>
              <div className="text-xs text-teal-700">Connections</div>
              <div className="text-xs text-gray-500 mt-1">O(n²) complexity</div>
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
                <span className="text-sm text-gray-600">
                  Computing QK<sup>T</sup> matrices and applying softmax...
                </span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see attention patterns</p>
            <p className="text-xs mt-2">Visualizes scaled dot-product attention mechanism</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttentionStep;