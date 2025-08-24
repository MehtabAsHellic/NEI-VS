import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const LandingHero: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuthStore();
  const [animatedTokens, setAnimatedTokens] = React.useState<number[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTokens(prev => {
        const newTokens = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20));
        return newTokens;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      // Show user-friendly error message
      alert('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>Powered by Google Gemini AI</span>
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover AI with{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NEI-VS Sandbox
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Sign in with Google to explore how Large Language Models work through interactive visualizations. 
                Access your personal dashboard and dive deep into AI mechanics.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleSignIn}
                disabled={isLoading}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="h-5 w-5" />
                    </motion.div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign In with Google</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              <motion.div
                className="flex items-center space-x-2 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No Credit Card Required</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">6+</div>
                <div className="text-sm text-gray-600 font-medium">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">Live</div>
                <div className="text-sm text-gray-600 font-medium">Visualizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">Free</div>
                <div className="text-sm text-gray-600 font-medium">Access</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Preview */}
          <motion.div
            className="relative lg:pl-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">LLM Pipeline Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Pipeline Steps */}
                <div className="space-y-4">
                  {[
                    { step: 'Tokenization', color: 'blue', icon: '🔤' },
                    { step: 'Embeddings', color: 'purple', icon: '🧠' },
                    { step: 'Attention', color: 'green', icon: '👁️' },
                    { step: 'Generation', color: 'orange', icon: '✨' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.step}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <motion.div
                            className={`bg-${item.color}-500 h-2 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + Math.random() * 40}%` }}
                            transition={{ delay: 1 + index * 0.2, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Token Flow Visualization */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Token Flow:</div>
                  <div className="flex flex-wrap gap-1">
                    {['The', 'quick', 'brown', 'fox', 'jumps', 'over'].map((token, index) => (
                      <motion.span
                        key={index}
                        className={`px-2 py-1 text-xs rounded font-mono ${
                          animatedTokens.includes(index) 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white text-gray-700'
                        }`}
                        animate={{
                          scale: animatedTokens.includes(index) ? 1.1 : 1,
                          backgroundColor: animatedTokens.includes(index) ? '#4f46e5' : '#ffffff'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {token}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-400 rounded-full opacity-15 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingHero;