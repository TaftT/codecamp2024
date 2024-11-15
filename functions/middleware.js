const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-file.json')) // Path to your Firebase Admin SDK private key file
});

const authMiddleware = async (req, res, next) => {
  // Get the ID token from the Authorization header
  const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null;

  if (!token) {
    return res.status(403).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Add the user information to the request object for use in the route
    req.user = decodedToken;
    
    console.log('User authenticated:', req.user); // For debugging

    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;