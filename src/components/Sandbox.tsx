import React from 'react';
import ModelSelector from './ModelSelector';
import ControlPanel from './ControlPanel';
import VisualizationPanel from './visualizers/VisualizationPanel';

const Sandbox: React.FC = () => {
  const [selectedModel, setSelectedModel] = React.useState('llm');
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    // Reset visualization state
  };

  return (
    <div id="sandbox" className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Model Sandbox</h1>
          <p className="text-gray-600">
            Explore, interact, and learn how different AI models work through live visualizations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Selection</h3>
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </div>
            
            <ControlPanel 
              selectedModel={selectedModel}
              isPlaying={isPlaying}
              onPlayToggle={handlePlayToggle}
              onReset={handleReset}
            />
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2">
            <VisualizationPanel selectedModel={selectedModel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;