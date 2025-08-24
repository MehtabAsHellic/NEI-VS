import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
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
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Main Page
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
      <Sandbox onOpenLLMSandbox={() => setShowLLMSandbox(true)} />
      <Learn />
    </div>
  );
}

export default App;