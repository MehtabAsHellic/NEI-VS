import React from 'react';
import { useAuthStore } from './store/useAuthStore';
import { authService } from './lib/appwrite';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';

  React.useEffect(() => {
    // Handle routing based on URL and auth state
    if (isInitialized && !isLoading) {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      
      // Handle OAuth callback and dashboard routing
      if (currentPath === '/dashboard' || currentHash === '#dashboard' || currentPath.includes('dashboard')) {
        if (isAuthenticated) {
          // Clean URL and show dashboard
          window.history.replaceState(null, '', '/');
          setCurrentView('dashboard');
        } else {
          // Check if this is an OAuth callback
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('success') === 'true' || currentPath === '/dashboard') {
            // Try to get user session after OAuth
            authService.getCurrentUser().then(user => {
              if (user) {
                checkAuth(); // Refresh auth state
                setCurrentView('dashboard');
              } else {
                window.history.replaceState(null, '', '/');
                setCurrentView('landing');
              }
            });
          } else {
            window.history.replaceState(null, '', '/');
            setCurrentView('landing');
          }
        }
        return;
      }
      
      if (isAuthenticated) {
        if (currentHash === '#dashboard') {
          setCurrentView('dashboard');
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
  }, [isAuthenticated, isInitialized, isLoading, checkAuth]);