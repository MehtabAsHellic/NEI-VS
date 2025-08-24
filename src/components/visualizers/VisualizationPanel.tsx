import React from 'react';
import LLMVisualizer from './LLMVisualizer';
import CNNVisualizer from './CNNVisualizer';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface VisualizationPanelProps {
  selectedModel: string;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ selectedModel }) => {
  const renderVisualizer = () => {
    switch (selectedModel) {
      case 'llm':
        return <LLMVisualizer />;
      case 'cnn':
        return <CNNVisualizer />;
      case 'rnn':
        return <div className="flex items-center justify-center h-full text-gray-500">RNN Visualizer Coming Soon</div>;
      case 'classical':
        return <div className="flex items-center justify-center h-full text-gray-500">Classical ML Visualizer Coming Soon</div>;
      case 'rl':
        return <div className="flex items-center justify-center h-full text-gray-500">RL Visualizer Coming Soon</div>;
      case 'gnn':
        return <div className="flex items-center justify-center h-full text-gray-500">GNN Visualizer Coming Soon</div>;
      default:
        return <div className="flex items-center justify-center h-full text-gray-500">Select a model to begin</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Live Visualization</h2>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span>Training</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Loss: 0.234</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Acc: 92.5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg flex-1 p-4">
        {renderVisualizer()}
      </div>
    </div>
  );
};

export default VisualizationPanel;