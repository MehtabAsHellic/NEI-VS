import React from 'react';
import { ChevronDown, Brain, Camera, BarChart3, Repeat, Target, Network } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: 'llm', name: 'LLM (Transformer)', icon: Brain, color: 'bg-blue-500' },
  { id: 'cnn', name: 'CV (CNN)', icon: Camera, color: 'bg-green-500' },
  { id: 'rnn', name: 'RNN/Sequence', icon: Repeat, color: 'bg-purple-500' },
  { id: 'classical', name: 'Classical (SVM/Tree)', icon: BarChart3, color: 'bg-orange-500' },
  { id: 'rl', name: 'Reinforcement Learning', icon: Target, color: 'bg-red-500' },
  { id: 'gnn', name: 'Graph Neural Network', icon: Network, color: 'bg-teal-500' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedModelData && (
            <>
              <div className={`w-3 h-3 rounded-full ${selectedModelData.color}`}></div>
              <selectedModelData.icon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">{selectedModelData.name}</span>
            </>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className={`w-3 h-3 rounded-full ${model.color}`}></div>
              <model.icon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">{model.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;