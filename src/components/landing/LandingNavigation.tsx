import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const LandingNavigation: React.FC = () => {
  const { isAuthenticated, signInWithGoogle } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Learn', href: '#courses' },
    { name: 'Sandbox', href: '#sandbox', protected: true },
    { name: 'Models', href: '/models', protected: true },
    { name: 'Educators', href: '/educators', protected: true },
    { name: 'Docs', href: '/docs' }
  ];

  const handleNavClick = async (href: string, isProtected: boolean) => {
    if (isProtected && !isAuthenticated) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
      }
      return;
    }
    
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-semibold text-slate-900">NEI-VS</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.protected || false)}
                className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                  link.protected && !isAuthenticated ? 'opacity-60' : ''
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                {link.name}
                {link.protected && !isAuthenticated && (
                  <span className="ml-1 text-xs text-slate-400">*</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Demo
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-slate-200 py-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.protected || false)}
                className={`block w-full text-left px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors ${
                  link.protected && !isAuthenticated ? 'opacity-60' : ''
                }`}
              >
                {link.name}
                {link.protected && !isAuthenticated && (
                  <span className="ml-1 text-xs text-slate-400">*</span>
                )}
              </button>
            ))}
            <div className="px-4 pt-2">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                Get Demo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default LandingNavigation;