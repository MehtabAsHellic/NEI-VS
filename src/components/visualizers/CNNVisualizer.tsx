import React from 'react';
import { Image, Filter, Target } from 'lucide-react';

const CNNVisualizer: React.FC = () => {
  const [activeView, setActiveView] = React.useState('activations');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveView('activations')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'activations' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Image className="h-4 w-4" />
          <span>Activations</span>
        </button>
        
        <button
          onClick={() => setActiveView('filters')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'filters' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
        
        <button
          onClick={() => setActiveView('gradcam')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeView === 'gradcam' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Grad-CAM</span>
        </button>
      </div>

      <div className="flex-1">
        {activeView === 'activations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Feature Maps</h3>
              <div className="text-sm text-gray-600">Conv2D Layer 3</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Input Image</h4>
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg"></div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Feature Maps</h4>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded"
                      style={{
                        background: `linear-gradient(45deg, 
                          hsl(${i * 20}, 70%, ${50 + Math.random() * 30}%), 
                          hsl(${i * 20 + 60}, 70%, ${30 + Math.random() * 30}%))`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Receptive Field</h4>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Size: 32x32</div>
                <div className="text-sm text-gray-600">Stride: 2</div>
                <div className="text-sm text-gray-600">Padding: 1</div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'filters' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Convolutional Filters</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-8 gap-3">
                {Array.from({ length: 32 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <div
                      className="aspect-square rounded border"
                      style={{
                        background: `radial-gradient(circle, 
                          ${Math.random() > 0.5 ? '#3B82F6' : '#10B981'}, 
                          ${Math.random() > 0.5 ? '#1E40AF' : '#059669'})`,
                      }}
                    ></div>
                    <div className="text-xs text-center text-gray-600">F{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Filter Details</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Kernel Size:</span>
                  <span className="ml-2 font-medium">3x3</span>
                </div>
                <div>
                  <span className="text-gray-600">Channels:</span>
                  <span className="ml-2 font-medium">64</span>
                </div>
                <div>
                  <span className="text-gray-600">Parameters:</span>
                  <span className="ml-2 font-medium">576</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'gradcam' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Grad-CAM Saliency</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Original Image</h4>
                <div className="aspect-square bg-gradient-to-br from-indigo-200 to-purple-400 rounded-lg relative">
                  <div className="absolute inset-4 bg-white/20 rounded"></div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Saliency Map</h4>
                <div className="aspect-square bg-gradient-to-br from-red-200 to-yellow-400 rounded-lg relative opacity-75">
                  <div className="absolute inset-8 bg-red-500/60 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Classification Results</h4>
              <div className="space-y-2">
                {[
                  { label: 'Cat', confidence: 0.89 },
                  { label: 'Dog', confidence: 0.08 },
                  { label: 'Bird', confidence: 0.03 },
                ].map((result, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="w-16 text-sm font-medium">{result.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-xs text-gray-600">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
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

export default CNNVisualizer;