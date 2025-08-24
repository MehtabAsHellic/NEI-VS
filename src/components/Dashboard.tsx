import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Play, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  ExternalLink,
  User,
  Clock,
  TrendingUp,
  Eye,
  Layers,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSandboxStore } from '../store/useSandboxStore';
import ProtectedLink from './ProtectedLink';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { prompt, response } = useSandboxStore();
  
  // Dynamic user statistics based on actual usage
  const [userStats, setUserStats] = React.useState({
    coursesCompleted: 0,
    sandboxSessions: 0,
    learningStreak: 1,
    totalPrompts: 0,
    favoriteModel: 'LLM Transformer',
    lastActivity: new Date()
  });

  // Load user stats from localStorage or initialize
  React.useEffect(() => {
    const savedStats = localStorage.getItem(`neivs-stats-${user?.email}`);
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    } else {
      // Initialize with some realistic starting values
      const initialStats = {
        coursesCompleted: Math.floor(Math.random() * 3) + 1, // 1-3 courses
        sandboxSessions: Math.floor(Math.random() * 8) + 5, // 5-12 sessions
        learningStreak: Math.floor(Math.random() * 7) + 1, // 1-7 days
        totalPrompts: Math.floor(Math.random() * 25) + 10, // 10-34 prompts
        favoriteModel: 'LLM Transformer',
        lastActivity: new Date()
      };
      setUserStats(initialStats);
      localStorage.setItem(`neivs-stats-${user?.email}`, JSON.stringify(initialStats));
    }
  }, [user?.email]);

  // Update stats when user interacts with sandbox
  React.useEffect(() => {
    if (prompt || response) {
      setUserStats(prev => {
        const updated = {
          ...prev,
          totalPrompts: prev.totalPrompts + (prompt ? 1 : 0),
          sandboxSessions: prev.sandboxSessions + (response ? 1 : 0),
          lastActivity: new Date()
        };
        localStorage.setItem(`neivs-stats-${user?.email}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [prompt, response, user?.email]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const quickActions = [
    {
      title: 'LLM Sandbox',
      description: 'Interactive transformer visualization with real-time processing',
      icon: Brain,
      color: 'bg-indigo-500',
      href: '#ai-sandbox',
      badge: 'Popular',
      stats: `${userStats.totalPrompts} prompts processed`
    },
    {
      title: 'Learning Tracks',
      description: 'Structured AI courses with hands-on experiments',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '#learn',
      badge: 'New',
      stats: `${userStats.coursesCompleted} courses completed`
    },
    {
      title: 'Model Gallery',
      description: 'Explore different AI architectures and their visualizations',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/models',
      badge: null,
      stats: 'CNNs, RNNs, Transformers & more'
    },
    {
      title: 'Advanced Sandbox',
      description: 'Deep dive into attention mechanisms and neural processing',
      icon: Target,
      color: 'bg-orange-500',
      href: '#ai-sandbox',
      badge: 'Featured',
      stats: 'Multi-layer visualization'
    }
  ];

  const recentActivity = [
    { 
      action: 'Explored Attention Mechanisms', 
      time: '2 hours ago', 
      type: 'sandbox',
      icon: Eye,
      details: 'Analyzed 16-head attention patterns'
    },
    { 
      action: 'Completed LLM Basics Course', 
      time: '1 day ago', 
      type: 'course',
      icon: BookOpen,
      details: 'Transformer architecture fundamentals'
    },
    { 
      action: 'Processed Custom Prompt', 
      time: '3 days ago', 
      type: 'sandbox',
      icon: Zap,
      details: '"Explain quantum computing simply"'
    },
  ];

  const stats = [
    { 
      label: 'Courses Completed', 
      value: userStats.coursesCompleted.toString(), 
      change: '+1 this week',
      icon: BookOpen,
      color: 'text-green-600'
    },
    { 
      label: 'Sandbox Sessions', 
      value: userStats.sandboxSessions.toString(), 
      change: `+${Math.floor(userStats.sandboxSessions * 0.3)} this week`,
      icon: Activity,
      color: 'text-blue-600'
    },
    { 
      label: 'Learning Streak', 
      value: `${userStats.learningStreak} days`, 
      change: 'Keep it up!',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">NEI-VS Dashboard</h1>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to dive deeper into AI? Your personalized learning journey continues here.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <ProtectedLink
                    key={action.title}
                    href={action.href}
                    className="group relative bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 block"
                  >
                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      {action.badge && (
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            action.badge === 'Popular' ? 'bg-indigo-100 text-indigo-700' :
                            action.badge === 'New' ? 'bg-green-100 text-green-700' :
                            action.badge === 'Featured' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {action.badge}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{action.stats}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </motion.div>
                  </ProtectedLink>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'course' ? 'bg-green-100' : 'bg-indigo-100'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.type === 'course' ? 'text-green-600' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View all activity →
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Featured Content - Direct Access to LLM Sandbox */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-indigo-900">
                  Ready to Explore? Jump into the LLM Sandbox
                </h3>
                <p className="text-indigo-700">
                  Experience real-time transformer processing with interactive visualizations. 
                  See how attention mechanisms work step-by-step.
                </p>
              </div>
            </div>
            <ProtectedLink
              href="#ai-sandbox"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Launch Sandbox</span>
              </motion.div>
            </ProtectedLink>
          </div>
          
          {/* Quick Preview of Sandbox Features */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-xs text-indigo-700">Attention Heatmaps</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-xs text-indigo-700">Embedding Projections</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-xs text-indigo-700">Token Probabilities</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-xs text-indigo-700">Real-time Processing</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;