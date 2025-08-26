import React from 'react';
import { useAuthStore } from './store/useAuthStore';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sandbox from './components/Sandbox';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhyNEIVS from './components/WhyNEIVS';
import AISandbox from './components/AISandbox';
import Learn from './components/Learn';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading, isInitialized, checkAuth } = useAuthStore();
  const [currentView, setCurrentView] = React.useState<'landing' | 'dashboard' | 'sandbox' | 'main'>('landing');

  React.useEffect(() => {
    // Initialize auth check if not already done
    if (!isInitialized) {
      checkAuth();
    }
  }, [checkAuth]);

  React.useEffect(() => {
    // Handle routing based on URL and auth state
    if (isInitialized && !isLoading) {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      
      // Handle sandbox routing
      if (currentPath === '/sandbox') {
        if (isAuthenticated) {
          setCurrentView('sandbox');
        } else {
          window.location.href = '/';
        }
        return;
      }
      
      // Clean up any OAuth redirect artifacts
      if (currentPath === '/dashboard' || currentHash === '#dashboard') {
        window.history.replaceState(null, '', '/');
        if (isAuthenticated) {
          setCurrentView('dashboard');
          return;
        }
      }
      
      if (isAuthenticated) {
        // For authenticated users, check what they're trying to access
        if (currentHash === '#dashboard' || currentPath === '/dashboard') {
          setCurrentView('dashboard');
        } else if (currentPath === '/sandbox') {
          setCurrentView('sandbox');
        } else if (currentHash && currentHash !== '#dashboard') {
          // Allow access to main app sections
          setCurrentView('main');
        } else {
          // Default to dashboard for authenticated users
          setCurrentView('dashboard');
        }
      } else {
        // Unauthenticated users see landing page
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, isInitialized, isLoading]);

  // Handle hash changes for navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      if (!isInitialized || isLoading) return;
      
      const hash = window.location.hash;
      const path = window.location.pathname;
      
      if (path === '/sandbox') {
        if (isAuthenticated) {
          setCurrentView('sandbox');
        } else {
          window.location.href = '/';
        }
        return;
      }
      
      if (hash === '#dashboard') {
        if (isAuthenticated) {
        setCurrentView('dashboard');
        } else {
          // Redirect unauthenticated users to landing
          window.location.hash = '';
          setCurrentView('landing');
        }
      } else if (hash && hash !== '#dashboard' && isAuthenticated) {
        setCurrentView('main');
      } else if (!hash) {
        if (isAuthenticated) {
          setCurrentView('dashboard');
        } else {
        setCurrentView('landing');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, isInitialized, isLoading]);

  // Show loading screen during initialization
  if (!isInitialized || isLoading) {
    return (
      <LandingPage />
    );
  }

  // Render based on current view
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'dashboard') {
    return (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    );
  }

  if (currentView === 'sandbox') {
    return (
      <ProtectedRoute>
        <Sandbox />
      </ProtectedRoute>
    );
  }

  // Show main app with protected sections
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <WhyNEIVS />
      <AISandbox />
      <Learn />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold">NEI-VS</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making AI education accessible through interactive visualizations and hands-on learning.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Model Sandbox</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visualizations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Simulations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 NEI-VS. Made with ❤️ for AI education.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-xs">Made in</span>
              <div className="bg-gray-800 px-2 py-1 rounded text-xs font-medium">
                Bolt
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ProtectedRoute>
  );
}

export default App;