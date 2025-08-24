/**
 * Embeddings visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const EmbeddingsStep: React.FC = () => {
  const { prompt, response, isProcessing } = useSandboxStore();

  // Generate mock embedding visualization
  const embeddings = React.useMemo(() => {
    if (!prompt) return [];
    
    const tokens = prompt.split(/\s+/).filter(t => t.length > 0);
    return tokens.map((token, index) => ({
      token,
      vector: Array.from({ length: 8 }, () => Math.random() * 2 - 1), // Simplified 8D instead of 768D
      similarity: Math.random() * 0.3 + 0.7, // Mock similarity score
      position: {
        x: 50 + Math.random() * 300,
        y: 50 + Math.random() * 200
      }
    }));
  }, [prompt]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Layers className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">Embeddings</h3>
        <div className="text-sm text-gray-600">
          768-dimensional vectors
        </div>
      </div>

      {prompt ? (
        <>
          {/* Vector Visualization */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Vector Representation (simplified to 8D)</h4>
            
            <div className="space-y-3">
              {embeddings.slice(0, 5).map((embedding, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg p-3 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-mono text-gray-700">
                      "{embedding.token}"
                    </div>
                    
                    <div className="flex-1 flex items-center space-x-1">
                      {embedding.vector.map((value, i) => (
                        <div
                          key={i}
                          className="flex-1 h-6 rounded"
                          style={{
                            backgroundColor: value > 0 
                              ? `rgba(59, 130, 246, ${Math.abs(value)})` 
                              : `rgba(239, 68, 68, ${Math.abs(value)})`,
                          }}
                          title={`Dimension ${i}: ${value.toFixed(3)}`}
                        />
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 w-12">
                      {(embedding.similarity * 100).toFixed(0)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2D Projection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">2D Projection (768D → 2D)</h4>
            
            <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden">
              <svg className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Embedding points */}
                {embeddings.map((embedding, index) => (
                  <motion.g key={index}>
                    <motion.circle
                      cx={embedding.position.x}
                      cy={embedding.position.y}
                      r="6"
                      fill={`hsl(${index * 40}, 70%, 60%)`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.8, scale: 1 }}
                      transition={{ delay: index * 0.2, type: "spring", damping: 15 }}
                      whileHover={{ scale: 1.5, opacity: 1 }}
                    />
                    <motion.text
                      x={embedding.position.x}
                      y={embedding.position.y - 12}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      {embedding.token}
                    </motion.text>
                  </motion.g>
                ))}
                
                {/* Similarity connections */}
                {embeddings.slice(0, -1).map((embedding, index) => (
                  <motion.line
                    key={`connection-${index}`}
                    x1={embedding.position.x}
                    y1={embedding.position.y}
                    x2={embeddings[index + 1]?.position.x}
                    y2={embeddings[index + 1]?.position.y}
                    stroke="#6366f1"
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="2,2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.1 + 1, duration: 0.5 }}
                  />
                ))}
              </svg>
            </div>
            
            <div className="mt-3 text-xs text-gray-600 text-center">
              Similar tokens cluster together in high-dimensional space
            </div>
          </div>

          {/* Embedding Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">768</div>
              <div className="text-xs text-purple-700">Dimensions</div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {embeddings.length}
              </div>
              <div className="text-xs text-indigo-700">Token Vectors</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(embeddings.reduce((sum, e) => sum + e.similarity, 0) / embeddings.length * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-blue-700">Avg Similarity</div>
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
                <Zap className="h-5 w-5 text-purple-600 animate-pulse" />
                <span className="text-sm text-gray-600">Converting tokens to vectors...</span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see embedding vectors</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbeddingsStep;