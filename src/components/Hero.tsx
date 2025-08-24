import React from 'react';
import { ArrowRight, Zap, Eye, Layers } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Navigate • Explain • Interact • Visualize • Simulate</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Learn AI by
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Doing</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Understand how AI works — from classical ML to LLMs and CNNs — through interactive visualizations, 
                step-by-step simulations, and hands-on experimentation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-gray-50">
                Watch Demo
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">6+</div>
                <div className="text-sm text-gray-600">Model Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">Live</div>
                <div className="text-sm text-gray-600">Visualizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">Interactive</div>
                <div className="text-sm text-gray-600">Sandbox</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Model Sandbox</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Attention Visualization</span>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded ${
                          Math.random() > 0.5 ? 'bg-blue-400' : 'bg-blue-200'
                        }`}
                        style={{ opacity: Math.random() * 0.8 + 0.2 }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Layer 12 • Head 8</span>
                    <span>Attention: 0.847</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">CNN Feature Maps</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;