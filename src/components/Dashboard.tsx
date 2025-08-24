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
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ProtectedLink from './ProtectedLink';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  
  // Debug logging to help troubleshoot
  React.useEffect(() => {
    console.log('Dashboard mounted, user:', user);
  }, [user]);

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
      description: 'Explore transformer models with interactive visualizations',
      icon: Brain,
      color: 'bg-indigo-500',
      href: '#ai-sandbox',
      badge: 'Popular'
    },
    {
      title: 'Learning Tracks',
      description: 'Structured courses on AI fundamentals',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '#learn',
      badge: 'New'
    },
    {
      title: 'Model Gallery',
      description: 'Browse different AI model architectures',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/models',
      badge: null
    },
    {
      title: 'Settings',
      description: 'Customize your learning experience',
      icon: Settings,
      color: 'bg-gray-500',
      href: '/settings',
      badge: null
    }
  ];

  const recentActivity = [
    { action: 'Completed LLM Basics', time: '2 hours ago', type: 'course' },
    { action: 'Explored Attention Mechanisms', time: '1 day ago', type: 'sandbox' },
    { action: 'Started CNN Visualization', time: '3 days ago', type: 'course' },
  ];

  const stats = [
    { label: 'Courses Completed', value: '3', change: '+1 this week' },
    { label: 'Sandbox Sessions', value: '12', change: '+4 this week' },
    { label: 'Learning Streak', value: '7 days', change: 'Keep it up!' },
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
              Ready to continue your AI learning journey? Pick up where you left off or explore something new.
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
                  <TrendingUp className="h-8 w-8 text-green-500" />
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
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'course' ? 'bg-green-500' : 'bg-indigo-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
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

          {/* Featured Content */}
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
                    New: Advanced Transformer Visualization
                  </h3>
                  <p className="text-indigo-700">
                    Dive deeper into attention mechanisms with our latest interactive sandbox features.
                  </p>
                </div>
              </div>
              <ProtectedLink
                href="#ai-sandbox"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Try Now</span>
                </motion.div>
              </ProtectedLink>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default Dashboard;