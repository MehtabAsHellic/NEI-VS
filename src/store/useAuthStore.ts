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
      set({ user, isAuthenticated: !!user });
      
      // Handle post-authentication routing
      if (user && window.location.pathname === '/dashboard') {
        window.history.replaceState(null, '', '/#dashboard');
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));