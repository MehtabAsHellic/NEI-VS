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
      // Use the current domain for redirect URLs
      const baseUrl = window.location.origin;
      await account.createOAuth2Session(
        'google',
        `${baseUrl}/?redirect=dashboard`, // Success URL
        `${baseUrl}/` // Failure URL
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
      // Don't log this as an error since it's expected when not authenticated
      return null;
    }
  },

  // Sign out
  async signOut() {
    try {
      await account.deleteSession('current');
      // Clear any stored state and redirect to home
      window.history.replaceState(null, '', '/');
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
};