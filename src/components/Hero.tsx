import React from 'react';
import { ArrowRight, Zap, Eye, Layers, Play, BookOpen } from 'lucide-react';

const Hero: React.FC = () => {
  const [animatedTiles, setAnimatedTiles] = React.useState<number[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTiles(prev => {
        const newTiles = Array.from({ length: 8 }, () => Math.floor(Math.random() * 64));
        return newTiles;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <Zap className="h-4 w-4" />
                <span>Navigate • Explain • Interact • Visualize • Simulate</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Learn AI by{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Doing
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Run, inspect, and simulate AI models. From classical ML to LLMs. 
                Visual, hands-on, and classroom-ready.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#llm-sandbox"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="h-5 w-5" />
                <span>Start Learning</span>
              </a>
              
              <button className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-gray-50 hover:-translate-y-1 flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">6+</div>
                <div className="text-sm text-gray-600 font-medium">Model Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">Live</div>
                <div className="text-sm text-gray-600 font-medium">Visualizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">Interactive</div>
                <div className="text-sm text-gray-600 font-medium">Sandbox</div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:pl-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Model Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">Attention Heatmap</span>
                    <div className="ml-auto text-xs text-gray-600">Layer 12 • Head 8</div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded transition-all duration-500 ${
                          animatedTiles.includes(i) ? 'bg-blue-600' : 
                          Math.random() > 0.6 ? 'bg-blue-400' : 'bg-blue-200'
                        }`}
                        style={{ 
                          opacity: animatedTiles.includes(i) ? 1 : Math.random() * 0.6 + 0.3,
                          transform: animatedTiles.includes(i) ? 'scale(1.1)' : 'scale(1)'
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-600 text-center">
                    <span>"The quick brown fox jumps over..."</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-800">Feature Maps</span>
                  <div className="ml-auto text-xs text-gray-600">Conv2D Layer 3</div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded transition-all duration-300 hover:scale-110"
                      style={{ 
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0.7 + Math.sin(Date.now() / 1000 + i) * 0.3 
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-400 rounded-full opacity-15 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;