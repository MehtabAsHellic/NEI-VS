/**
 * Final output generation visualization step
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Copy, Download, Sparkles } from 'lucide-react';
import { useSandboxStore } from '../../../store/useSandboxStore';

const OutputStep: React.FC = () => {
  const { prompt, response, isProcessing } = useSandboxStore();
  const [copiedText, setCopiedText] = React.useState(false);

  const handleCopy = async () => {
    if (response?.text) {
      await navigator.clipboard.writeText(response.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleDownload = () => {
    if (response) {
      const data = {
        prompt,
        response: response.text,
        timestamp: new Date().toISOString(),
        processingSteps: response.processingSteps
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'llm-response.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-900">Generated Output</h3>
        <div className="text-sm text-gray-600">
          Final response
        </div>
      </div>

      {response ? (
        <>
          {/* Generated Response */}
          <motion.div
            className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-indigo-900 flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>AI Response</span>
              </h4>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-2 bg-white/80 hover:bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                </motion.button>
                
                <motion.button
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-3 py-2 bg-white/80 hover:bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
            
            <div className="bg-white/90 rounded-lg p-4 text-gray-900 leading-relaxed">
              {response.text}
            </div>
          </motion.div>

          {/* Processing Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Processing Summary</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {response.processingSteps.tokenization.count}
                </div>
                <div className="text-xs text-gray-600">Input Tokens</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {response.processingSteps.embeddings.dimension}
                </div>
                <div className="text-xs text-gray-600">Embedding Dims</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {response.processingSteps.attention.layers}
                </div>
                <div className="text-xs text-gray-600">Attention Layers</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {response.processingSteps.attention.heads}
                </div>
                <div className="text-xs text-gray-600">Attention Heads</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {response.processingSteps.probabilities.topTokens.length}
                </div>
                <div className="text-xs text-gray-600">Top Tokens</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {response.processingSteps.processing.parameters}
                </div>
                <div className="text-xs text-gray-600">Parameters</div>
              </div>
            </div>
          </div>

          {/* Token Trace */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Generation Trace</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Input:</span>
                <span className="font-mono bg-white px-2 py-1 rounded text-blue-700">
                  "{prompt}"
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Focus tokens:</span>
                <div className="flex space-x-1">
                  {response.processingSteps.attention.focusTokens.map((token, index) => (
                    <span
                      key={index}
                      className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Top predictions:</span>
                <div className="flex space-x-1">
                  {response.processingSteps.probabilities.topTokens.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="font-mono bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                    >
                      {item.token} ({(item.probability * 100).toFixed(0)}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-green-800 mb-2">Response Quality</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Coherence</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-[95%]"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-800 mb-2">Relevance</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Topic Match</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : isProcessing ? (
        <motion.div
          className="flex items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Sparkles className="h-12 w-12 mx-auto text-indigo-600" />
            </motion.div>
            <p className="text-gray-600">Generating response...</p>
            <div className="mt-2 text-sm text-gray-500">
              This may take a few moments
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Run the inference to see the generated output</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputStep;