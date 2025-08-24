import { create } from 'zustand';
import { authService } from '../lib/appwrite';

interface User {
  $id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true });
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await authService.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.getCurrentUser();
      
      if (user) {
        set({ user, isAuthenticated: true });
        
        // Handle post-authentication routing
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        // If user just completed OAuth and should go to dashboard
        if (currentPath === '/dashboard' || redirect === 'dashboard') {
          // Clean URL and set hash
          const newUrl = window.location.origin + '/#dashboard';
          window.history.replaceState(null, '', newUrl);
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));