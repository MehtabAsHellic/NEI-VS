import React from 'react';
import { Brain, BookOpen, Gamepad2, Layers, Users, FileText, Play, Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['learn', 'ai-sandbox'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NEI-VS</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                activeSection === '' ? 'text-blue-600' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('learn')}
              className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                activeSection === 'learn' ? 'text-blue-600' : ''
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </button>
            <button 
              onClick={() => scrollToSection('ai-sandbox')}
              className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                activeSection === 'ai-sandbox' ? 'text-blue-600' : ''
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Sandbox</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <Layers className="h-4 w-4" />
              <span>Models</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <Users className="h-4 w-4" />
              <span>Educators</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/#dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </a>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/'}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
            <button className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Get Demo</span>
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('learn')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Learn
            </button>
            <button 
              onClick={() => scrollToSection('ai-sandbox')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Sandbox
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              Models
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              Educators
            </button>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
              Docs
            </button>
            
            {isAuthenticated ? (
              <>
                <a
                  href="/#dashboard"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Dashboard
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 pt-2">
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
            <div className="px-4 pt-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Get Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;