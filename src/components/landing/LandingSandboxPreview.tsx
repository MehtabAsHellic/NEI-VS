import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles, Eye, BarChart3, Layers } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const LandingSandboxPreview: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuthStore();
  const [activeDemo, setActiveDemo] = React.useState('attention');
  
  const demoTabs = [
    { id: 'attention', label: 'Attention', icon: Eye, color: 'blue' },
    { id: 'embeddings', label: 'Embeddings', icon: Layers, color: 'purple' },
    { id: 'probabilities', label: 'Probabilities', icon: BarChart3, color: 'green' },
  ];

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'attention':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">Input: "The quick brown fox"</div>
              <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto">
                {Array.from({ length: 16 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${0.2 + Math.random() * 0.8})`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
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
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      backgroundColor: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
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
              <motion.div
                key={i}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="w-12 text-xs font-mono">{item.token}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.prob * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                  />
                </div>
                <span className="w-8 text-xs text-gray-600">{(item.prob * 100).toFixed(0)}%</span>
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Sandbox Preview</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See AI in Action
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore a tiny Transformer end-to-end: tokenization → embeddings → attention → probabilities.
            See how language models actually work, step by step.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Preview Description */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Experience</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Real-time Processing</h4>
                    <p className="text-sm text-gray-600">Watch your text flow through each stage of the LLM pipeline</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Interactive Controls</h4>
                    <p className="text-sm text-gray-600">Adjust temperature, top-k, and other parameters to see their effects</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Visual Insights</h4>
                    <p className="text-sm text-gray-600">Beautiful charts and heatmaps reveal the model's inner workings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Ready to Explore?</h3>
              <p className="text-indigo-700 mb-4">
                Sign in with Google to access the full interactive sandbox and start your AI learning journey.
              </p>
              <div className="flex items-center space-x-2 text-sm text-indigo-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Free access • No setup required</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Preview */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Live Visualization</h3>
              
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {demoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDemo(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeDemo === tab.id
                        ? `bg-white text-${tab.color}-600 shadow-sm`
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
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-5 w-5" />
            <span>{isLoading ? 'Signing In...' : 'Access Full Sandbox'}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <p className="text-sm text-gray-600 mt-3">
            Experiment with real transformer math • No coding required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingSandboxPreview;