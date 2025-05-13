/**
 * Helper functions for authentication
 */

/**
 * Check if a provider is properly configured in Firebase
 * @param {Object} provider - The Firebase auth provider
 * @returns {Promise<boolean>} - True if the provider is configured, false otherwise
 */
export const isProviderConfigured = async (provider) => {
  try {
    // Try to get provider data
    const providerId = provider.providerId;
    
    // For Facebook, check if app ID is set
    if (providerId === 'facebook.com') {
      // Facebook requires an app ID to be configured in Firebase console
      const params = provider.customParameters;
      if (!params || !params.client_id) {
        console.warn('Facebook provider may not be properly configured in Firebase console');
        return false;
      }
    }
    
    // For Twitter, check if API key is set
    if (providerId === 'twitter.com') {
      // Twitter requires API key to be configured in Firebase console
      const params = provider.customParameters;
      if (!params || !params.oauth_consumer_key) {
        console.warn('Twitter provider may not be properly configured in Firebase console');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking provider configuration:', error);
    return false;
  }
};

/**
 * Format authentication error messages for user display
 * @param {Error} error - The Firebase auth error
 * @returns {string} - User-friendly error message
 */
export const formatAuthError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle specific Firebase auth error codes
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      return 'The authentication popup was closed before completing the sign in process.';
    case 'auth/popup-blocked':
      return 'The authentication popup was blocked by the browser. Please allow popups for this website.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth operations. Please contact the administrator.';
    case 'auth/operation-not-allowed':
      return 'This authentication provider is not enabled. Please contact the administrator.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your internet connection.';
    default:
      return error.message || 'An error occurred during authentication.';
  }
};
