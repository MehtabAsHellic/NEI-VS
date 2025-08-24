import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhyNEIVS from './components/WhyNEIVS';
import LLMSandboxSection from './components/LLMSandboxSection';
import Sandbox from './components/Sandbox';
import Learn from './components/Learn';
import LLMSandbox from './components/LLMSandbox';

function App() {
  const [showLLMSandbox, setShowLLMSandbox] = React.useState(false);

  if (showLLMSandbox) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <button
              onClick={() => setShowLLMSandbox(false)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Main Page</span>
            </button>
          </div>
          <LLMSandbox />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <WhyNEIVS />
      <Sandbox onOpenLLMSandbox={() => setShowLLMSandbox(true)} />
      <LLMSandboxSection onOpenSandbox={() => setShowLLMSandbox(true)} />
      <Learn />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold">NEI-VS</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making AI education accessible through interactive visualizations and hands-on learning.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Model Sandbox</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visualizations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Simulations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 NEI-VS. Made with ❤️ for AI education.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-xs">Made in</span>
              <div className="bg-gray-800 px-2 py-1 rounded text-xs font-medium">
                Bolt
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;