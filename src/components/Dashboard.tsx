import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Settings, 
  Play, 
  Clock, 
  Calendar,
  Mail,
  Zap,
  ArrowRight,
  Moon,
  Sun,
  Key
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSandboxStore } from '../store/useSandboxStore';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { prompt } = useSandboxStore();
  
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [geminiApiKey, setGeminiApiKey] = React.useState('');
  
  // Get user stats from localStorage
  const [userStats, setUserStats] = React.useState({
    joinDate: new Date(),
    lastLogin: new Date(),
    recentPrompts: [] as string[]
  });

  React.useEffect(() => {
    const savedStats = localStorage.getItem(`neivs-user-${user?.email}`);
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setUserStats({
        joinDate: new Date(parsed.joinDate || Date.now()),
        lastLogin: new Date(parsed.lastLogin || Date.now()),
        recentPrompts: parsed.recentPrompts || []
      });
    } else {
      // Initialize for new user
      const initialStats = {
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        recentPrompts: []
      };
      localStorage.setItem(`neivs-user-${user?.email}`, JSON.stringify(initialStats));
    }
  }, [user?.email]);

  // Update last login on mount
  React.useEffect(() => {
    if (user?.email) {
      const stats = {
        ...userStats,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem(`neivs-user-${user.email}`, JSON.stringify(stats));
    }
  }, [user?.email]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleLaunchSandbox = () => {
    window.location.href = '/sandbox';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">NEI-VS</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Your AI learning journey starts here.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - User Information & Settings */}
          <div className="space-y-8">
            {/* User Information Card */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.name || 'Anonymous User'}</div>
                    <div className="text-sm text-gray-600 flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Joined</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDate(userStats.joinDate)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Last Login</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDate(userStats.lastLogin)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Card */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              </div>
              
              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-gray-600" />}
                    <span className="text-gray-700">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Notifications</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* API Key Input */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Key className="h-4 w-4" />
                    <span>Custom Gemini API Key (Optional)</span>
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Use your own API key for unlimited requests
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Access */}
          <div className="space-y-8">
            {/* Launch Sandbox Card */}
            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Play className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    LLM Sandbox
                  </h2>
                  <p className="text-gray-600">
                    Explore transformer models with interactive visualizations. 
                    See how attention, embeddings, and neural layers work in real-time.
                  </p>
                </div>

                <motion.button
                  onClick={handleLaunchSandbox}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="h-5 w-5" />
                  <span>Launch Sandbox</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              
              {userStats.recentPrompts.length > 0 ? (
                <div className="space-y-3">
                  {userStats.recentPrompts.slice(0, 3).map((recentPrompt, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-900 font-medium mb-1">
                        Prompt Processed
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        "{recentPrompt}"
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleLaunchSandbox}
                    className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 transition-colors"
                  >
                    View all activity →
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    No recent activity yet. Start exploring!
                  </p>
                  <button
                    onClick={handleLaunchSandbox}
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Launch your first session →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <button
              onClick={handleLaunchSandbox}
              className="hover:text-gray-700 transition-colors"
            >
              Sandbox
            </button>
            <a href="/docs" className="hover:text-gray-700 transition-colors">
              Docs
            </a>
            <button
              onClick={handleSignOut}
              className="hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Dashboard;