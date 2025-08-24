import React from 'react';
import { Eye, Layers, BarChart3 } from 'lucide-react';

const LLMVisualizer: React.FC = () => {
  const [activeView, setActiveView] = React.useState('attention');
  
  const tokens = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];
  const attentionWeights = tokens.map(() => tokens.map(() => Math.random()));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveView('attention')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'attention' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Attention</span>
        </button>
        
        <button
          onClick={() => setActiveView('embeddings')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'embeddings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Embeddings</span>
        </button>
        
        <button
          onClick={() => setActiveView('probabilities')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'probabilities' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Probabilities</span>
        </button>
      </div>

      <div className="flex-1">
        {activeView === 'attention' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Attention Heatmap</h3>
              <div className="text-sm text-gray-600">Layer 12 • Head 8</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-9 gap-1 mb-2">
                {tokens.map((token, i) => (
                  <div key={i} className="text-xs font-medium text-gray-700 text-center p-1">
                    {token}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-9 gap-1">
                {attentionWeights.map((row, i) =>
                  row.map((weight, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square rounded"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${weight})`,
                      }}
                      title={`Attention: ${weight.toFixed(3)}`}
                    ></div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Token Trace</h4>
              <div className="flex flex-wrap gap-2">
                {tokens.map((token, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                    style={{ opacity: 0.3 + Math.random() * 0.7 }}
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'embeddings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Embedding Projector</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-80">
              <div className="relative h-full">
                <svg className="w-full h-full">
                  {Array.from({ length: 50 }, (_, i) => (
                    <circle
                      key={i}
                      cx={Math.random() * 300 + 50}
                      cy={Math.random() * 200 + 50}
                      r={4}
                      fill={`hsl(${Math.random() * 360}, 70%, 50%)`}
                      className="opacity-70"
                    />
                  ))}
                </svg>
                
                <div className="absolute bottom-2 left-2 text-xs text-gray-600">
                  UMAP Projection • 768D → 2D
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'probabilities' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Next Token Probabilities</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                {[
                  { token: 'quickly', prob: 0.34 },
                  { token: 'brown', prob: 0.28 },
                  { token: 'lazy', prob: 0.15 },
                  { token: 'over', prob: 0.12 },
                  { token: 'fox', prob: 0.08 },
                  { token: 'other', prob: 0.03 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="w-16 text-sm font-medium text-gray-900">{item.token}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.prob * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-xs text-gray-600">{(item.prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMVisualizer;