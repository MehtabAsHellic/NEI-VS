import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Copy, 
  Settings,
  Zap,
  Type,
  Layers,
  Eye,
  Cpu,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { useSandboxStore } from '../store/useSandboxStore';
import { generateWithGemini } from '../lib/gemini';

const Sandbox: React.FC = () => {
  const {
    prompt,
    temperature,
    topK,
    isProcessing,
    response,
    setPrompt,
    setTemperature,
    setTopK,
    setIsProcessing,
    setResponse,
    setError,
    reset
  } = useSandboxStore();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [copiedText, setCopiedText] = React.useState(false);

  const pipelineSteps = [
    { id: 'tokenization', title: 'Tokenization', icon: Type, color: 'blue' },
    { id: 'embeddings', title: 'Embeddings', icon: Layers, color: 'purple' },
    { id: 'attention', title: 'Attention', icon: Eye, color: 'green' },
    { id: 'processing', title: 'Neural Layers', icon: Cpu, color: 'orange' },
    { id: 'probabilities', title: 'Probabilities', icon: BarChart3, color: 'red' },
    { id: 'output', title: 'Output', icon: MessageSquare, color: 'indigo' }
  ];

  const handleRunInference = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    reset();
    setIsProcessing(true);
    setError(null);

    try {
      // Animate through pipeline steps
      for (let i = 0; i < pipelineSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate response
      const result = await generateWithGemini(prompt, temperature, topK);
      setResponse(result);

      // Update user's recent prompts
      const userEmail = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.email;
      if (userEmail) {
        const userStatsKey = `neivs-user-${userEmail}`;
        const currentStats = JSON.parse(localStorage.getItem(userStatsKey) || '{}');
        const updatedStats = {
          ...currentStats,
          recentPrompts: [prompt, ...(currentStats.recentPrompts || [])].slice(0, 10),
          lastActivity: new Date().toISOString()
        };
        localStorage.setItem(userStatsKey, JSON.stringify(updatedStats));
      }

    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate response');
    } finally {
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  const handleCopy = async () => {
    if (response?.text) {
      await navigator.clipboard.writeText(response.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">LLM Sandbox</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>{isProcessing ? 'Processing' : 'Ready'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Prompt Input & Controls */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900">
                Enter your prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything... (e.g., 'Explain quantum physics in simple terms')"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                disabled={isProcessing}
              />
              <div className="text-sm text-gray-500 text-right">
                {prompt.length}/500 characters
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isProcessing}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Top-K: {topK}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-green-200 to-purple-300 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isProcessing}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Precise</span>
                  <span>Diverse</span>
                </div>
              </div>

              <div className="flex items-end">
                <motion.button
                  onClick={handleRunInference}
                  disabled={!prompt.trim() || isProcessing}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !prompt.trim() || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={!prompt.trim() || isProcessing ? {} : { scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="h-5 w-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Run Inference</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Pipeline & Output */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pipeline Visualization */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Processing Pipeline</h2>
            
            <div className="space-y-4">
              {pipelineSteps.map((step, index) => {
                const isActive = isProcessing && currentStep === index;
                const isCompleted = isProcessing && currentStep > index;
                
                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? `border-${step.color}-500 bg-${step.color}-50`
                        : isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive || isCompleted
                        ? `bg-${step.color}-600 text-white`
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isActive ? 'Processing...' : 
                         isCompleted ? 'Complete' : 'Waiting'}
                      </div>
                    </div>
                    
                    {isCompleted && (
                      <motion.div
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Output */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Generated Output</h2>
              
              {response && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            
            <div className="min-h-[300px] flex items-center justify-center">
              {response ? (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {response.text}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-indigo-600">
                        {response.processingSteps.tokenization.count}
                      </div>
                      <div className="text-xs text-gray-600">Input Tokens</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600">
                        {response.processingSteps.embeddings.dimension}
                      </div>
                      <div className="text-xs text-gray-600">Dimensions</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {response.processingSteps.attention.layers}
                      </div>
                      <div className="text-xs text-gray-600">Layers</div>
                    </div>
                  </div>
                </motion.div>
              ) : isProcessing ? (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Zap className="h-12 w-12 mx-auto text-indigo-600" />
                  </motion.div>
                  <p className="text-gray-600">Generating response...</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Step {currentStep + 1} of {pipelineSteps.length}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Enter a prompt and run inference to see the output</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <button
              onClick={handleBackToDashboard}
              className="hover:text-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <button className="hover:text-gray-700 transition-colors">
              Settings
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Sandbox;