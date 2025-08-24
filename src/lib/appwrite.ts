import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68aae65f003b57c70a64');

const account = new Account(client);

export { client, account };

// Auth helper functions
export const authService = {
  // Create Google OAuth2 session
  async signInWithGoogle() {
    try {
      await account.createOAuth2Session(
        'google',
        'https://neivs.vercel.app/dashboard',
        'https://neivs.vercel.app/'
      );
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Sign out
  async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
};