/**
 * Neural layer processing visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Zap } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const ProcessingStep: React.FC = () => {
  const { prompt, response, isProcessing } = useSandboxStore();

  const [activeLayer, setActiveLayer] = React.useState(0);
  const totalLayers = 24;

  // Simulate layer processing
  const layerData = React.useMemo(() => {
    return Array.from({ length: totalLayers }, (_, index) => ({
      layer: index,
      neurons: 3072, // Typical FFN size
      activations: Array.from({ length: 12 }, () => Math.random()),
      processing: Math.random() * 0.5 + 0.3, // Processing intensity
    }));
  }, []);

  React.useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setActiveLayer(prev => (prev + 1) % totalLayers);
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isProcessing, totalLayers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Cpu className="h-6 w-6 text-orange-600" />
        <h3 className="text-xl font-semibold text-gray-900">Neural Layer Processing</h3>
        <div className="text-sm text-gray-600">
          {totalLayers} transformer layers
        </div>
      </div>

      {prompt ? (
        <>
          {/* Layer Architecture Overview */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Transformer Architecture</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Input Flow */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 text-center">Input</div>
                <div className="bg-blue-100 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-blue-800">Token Embeddings</div>
                  <div className="text-xs text-blue-600">768 dimensions</div>
                </div>
              </div>

              {/* Processing Layers */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 text-center">Processing</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {layerData.slice(0, 8).map((layer, index) => (
                    <motion.div
                      key={layer.layer}
                      className={`rounded p-2 text-center transition-all ${
                        activeLayer === layer.layer
                          ? 'bg-orange-600 text-white shadow-lg'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                      animate={{
                        scale: activeLayer === layer.layer ? 1.05 : 1,
                        opacity: activeLayer === layer.layer ? 1 : 0.7
                      }}
                    >
                      <div className="text-xs font-medium">Layer {layer.layer + 1}</div>
                      <div className="text-xs opacity-75">{layer.neurons} neurons</div>
                    </motion.div>
                  ))}
                  <div className="text-xs text-gray-500 text-center py-1">
                    ... {totalLayers - 8} more layers
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 text-center">Output</div>
                <div className="bg-green-100 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-green-800">Logits</div>
                  <div className="text-xs text-green-600">Vocabulary size</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Layer Detail */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700">
                Layer {activeLayer + 1} Activity
              </h4>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveLayer(Math.max(0, activeLayer - 1))}
                  className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  disabled={activeLayer === 0}
                >
                  ←
                </button>
                <span className="text-xs text-gray-600">
                  {activeLayer + 1} / {totalLayers}
                </span>
                <button
                  onClick={() => setActiveLayer(Math.min(totalLayers - 1, activeLayer + 1))}
                  className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  disabled={activeLayer === totalLayers - 1}
                >
                  →
                </button>
              </div>
            </div>

            {/* Neuron Activations */}
            <div className="space-y-3">
              <div className="text-xs text-gray-600">Neuron Activations (sample):</div>
              
              <div className="grid grid-cols-12 gap-1">
                {layerData[activeLayer]?.activations.map((activation, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square rounded"
                    style={{
                      backgroundColor: `rgba(251, 146, 60, ${activation})`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    title={`Neuron ${index + 1}: ${(activation * 100).toFixed(1)}%`}
                  />
                ))}
              </div>

              {/* Processing Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {layerData[activeLayer]?.neurons.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Neurons</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-600">
                    {((layerData[activeLayer]?.processing || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {(layerData[activeLayer]?.activations.reduce((sum, a) => sum + a, 0) / 12 * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Avg Activation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Flow */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Processing Flow</h4>
            
            <div className="flex items-center justify-between text-xs">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                  1
                </div>
                <div>Self-Attention</div>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                  2
                </div>
                <div>Add & Norm</div>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                  3
                </div>
                <div>Feed Forward</div>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                  4
                </div>
                <div>Add & Norm</div>
              </div>
            </div>
          </div>

          {/* Model Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">7B</div>
              <div className="text-xs text-orange-700">Parameters</div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">24</div>
              <div className="text-xs text-amber-700">Layers</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">16</div>
              <div className="text-xs text-yellow-700">Attention Heads</div>
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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-orange-600" />
                </motion.div>
                <span className="text-sm text-gray-600">
                  Processing through layer {activeLayer + 1}...
                </span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <Cpu className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Enter a prompt to see neural processing</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingStep;