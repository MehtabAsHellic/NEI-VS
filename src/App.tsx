import React from 'react';
import { useAuthStore } from './store/useAuthStore';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhyNEIVS from './components/WhyNEIVS';
import AISandbox from './components/AISandbox';
import Learn from './components/Learn';
import { Loader } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [showLanding, setShowLanding] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'landing' | 'dashboard' | 'main'>('landing');

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    // Check for redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'dashboard' && isAuthenticated) {
      // Clean up URL and redirect to dashboard
      window.history.replaceState(null, '', '/#dashboard');
      setCurrentView('dashboard');
      setShowLanding(false);
      return;
    }
    
    const handleRouting = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      // Handle direct /dashboard URL (redirect from Appwrite)
      if (pathname === '/dashboard' && isAuthenticated) {
        window.history.replaceState(null, '', '/#dashboard');
        setCurrentView('dashboard');
        setShowLanding(false);
        return;
      }
      
      // Handle hash-based routing
      if (hash === '#dashboard' && isAuthenticated) {
        setCurrentView('dashboard');
        setShowLanding(false);
      } else if (hash && hash !== '#dashboard') {
        setCurrentView('main');
        setShowLanding(false);
      } else if (!isAuthenticated) {
        setCurrentView('landing');
        setShowLanding(true);
      }
    };
    
    handleRouting();
  }, [isAuthenticated]);

  // Handle hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dashboard' && isAuthenticated) {
        setCurrentView('dashboard');
        setShowLanding(false);
      } else if (hash && hash !== '#dashboard') {
        setCurrentView('main');
        setShowLanding(false);
      } else if (!hash && !isAuthenticated) {
        setCurrentView('landing');
        setShowLanding(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users or when explicitly requested
  if (showLanding && currentView === 'landing') {
    return <LandingPage />;
  }

  // Show dashboard for authenticated users when requested
  if (currentView === 'dashboard' && isAuthenticated) {
    return <Dashboard />;
  }

  // Show main app (original NEI-VS interface)
  return (
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
  );
}

export default App;