import React from 'react';
import { Brain, BookOpen, Gamepad2, Layers, Users, FileText, Play } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NEI-VS</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </a>
            <a href="#learn" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </a>
            <a href="#sandbox" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <Gamepad2 className="h-4 w-4" />
              <span>Sandbox</span>
            </a>
            <a href="#models" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <Layers className="h-4 w-4" />
              <span>Models</span>
            </a>
            <a href="#educators" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <Users className="h-4 w-4" />
              <span>Educators</span>
            </a>
            <a href="#docs" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </a>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Get Demo</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;