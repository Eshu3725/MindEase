// api.js - Utility functions for making authenticated API requests

/**
 * Makes an authenticated API request to the backend
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise<Object>} - The JSON response from the API
 */
async function apiRequest(endpoint, options = {}) {
  // Get the authentication token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Set up default options
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  // Merge default options with provided options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    }
  };
  
  // Add the authorization header if a token exists
  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  // Convert the body to JSON if it's an object
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  
  // Make the API request
  const response = await fetch(`http://localhost:5000/api/${endpoint}`, fetchOptions);
  
  // Parse the JSON response
  const data = await response.json();
  
  // If the response is not ok, throw an error
  if (!response.ok) {
    const error = new Error(data.error || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} - The user profile
 */
export async function getUserProfile() {
  return apiRequest('users/profile');
}

/**
 * Update user preferences
 * @param {Object} preferences - The user preferences to update
 * @returns {Promise<Object>} - The API response
 */
export async function updateUserPreferences(preferences) {
  return apiRequest('users/preferences', {
    method: 'POST',
    body: preferences
  });
}

/**
 * Verify if the current token is valid
 * @returns {Promise<Object>} - The verification result
 */
export async function verifyToken() {
  return apiRequest('users/verify-token');
}

export default apiRequest;
