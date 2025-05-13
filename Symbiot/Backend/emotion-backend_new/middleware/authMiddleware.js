const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

/**
 * Middleware to verify Firebase authentication token
 * Extracts the token from the Authorization header and verifies it
 * If valid, adds the decoded user information to the request object
 */
const verifyToken = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add the user information to the request
    req.user = decodedToken;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = { verifyToken };
