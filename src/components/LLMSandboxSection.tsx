import React from 'react';
import { Brain, Zap, Eye, BarChart3, ExternalLink, Play } from 'lucide-react';

interface LLMSandboxSectionProps {
  onOpenSandbox?: () => void;
}

const LLMSandboxSection: React.FC<LLMSandboxSectionProps> = ({ onOpenSandbox }) => {
  const [activeDemo, setActiveDemo] = React.useState('attention');
  
  const demoTabs = [
    { id: 'attention', label: 'Attention', icon: Eye },
    { id: 'embeddings', label: 'Embeddings', icon: Brain },
    { id: 'probabilities', label: 'Probabilities', icon: BarChart3 },
  ];

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'attention':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">Input: "The quick brown fox"</div>
              <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto">
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${0.2 + Math.random() * 0.8})`,
                      animation: `pulse ${1 + Math.random()}s infinite`
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Layer 2 • Head 1</div>
            </div>
          </div>
        );
      case 'embeddings':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-4">768D → 2D Projection</div>
              <div className="relative w-64 h-32 mx-auto bg-gray-50 rounded-lg overflow-hidden">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      backgroundColor: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
                      animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'probabilities':
        return (
          <div className="space-y-3">
            {[
              { token: 'jumps', prob: 0.34 },
              { token: 'runs', prob: 0.28 },
              { token: 'walks', prob: 0.15 },
              { token: 'moves', prob: 0.12 },
              { token: 'goes', prob: 0.08 },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <span className="w-12 text-xs font-mono">{item.token}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.prob * 100}%` }}
                  ></div>
                </div>
                <span className="w-8 text-xs text-gray-600">{(item.prob * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="llm-sandbox" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Interactive Sandbox</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Model Sandbox
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore a tiny Transformer end-to-end: tokenization → embeddings → attention → probabilities.
            See how language models actually work, step by step.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Controls Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Text
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                    "The quick brown fox jumps over..."
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: 0.7
                  </label>
                  <div className="w-full h-2 bg-gray-200 rounded-lg">
                    <div className="w-2/3 h-2 bg-blue-600 rounded-lg"></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layer View: 2
                  </label>
                  <div className="w-full h-2 bg-gray-200 rounded-lg">
                    <div className="w-1/3 h-2 bg-purple-600 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Training</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loss</span>
                  <span className="text-sm font-medium text-gray-900">0.234</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="text-sm font-medium text-gray-900">92.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visualization Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Live Visualization</h3>
              
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {demoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDemo(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeDemo === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              {renderDemoContent()}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenSandbox}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
          >
            <Play className="h-5 w-5" />
            <span>Open Full Sandbox</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <p className="text-sm text-gray-600 mt-3">
            Experiment with real transformer math • No coding required
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default LLMSandboxSection;