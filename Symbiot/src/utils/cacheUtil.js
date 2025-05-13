/**
 * Simple cache utility for storing API responses
 * Helps reduce API calls and improve performance
 */

// Cache storage
const cache = {};

// Default cache expiration time (30 minutes)
const DEFAULT_EXPIRATION = 30 * 60 * 1000;

/**
 * Get an item from the cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if not found/expired
 */
const getCachedItem = (key) => {
  const cachedItem = cache[key];
  
  // Return null if item doesn't exist
  if (!cachedItem) {
    return null;
  }
  
  // Check if item has expired
  const now = new Date().getTime();
  if (now > cachedItem.expiration) {
    // Remove expired item
    delete cache[key];
    return null;
  }
  
  return cachedItem.value;
};

/**
 * Set an item in the cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} expiration - Expiration time in milliseconds (optional)
 */
const setCachedItem = (key, value, expiration = DEFAULT_EXPIRATION) => {
  const now = new Date().getTime();
  
  cache[key] = {
    value,
    expiration: now + expiration
  };
};

/**
 * Clear the entire cache or a specific item
 * @param {string} key - Specific key to clear (optional)
 */
const clearCache = (key = null) => {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};

export { getCachedItem, setCachedItem, clearCache };
