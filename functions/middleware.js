const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-file.json')), // Path to your Firebase Admin SDK private key file
  databaseURL: "https://code-camp-showcase-default-rtdb.firebaseio.com"
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

const authMiddlewareUserData = async (req, res, next) => {
  // Get the ID token from the Authorization header
  const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null;

  if (!token) {
    return res.status(403).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Add the user information from the decoded token to the request object
    req.user = decodedToken;

    // Retrieve additional user data from the database
    const userRef = admin.database().ref('users');
    const snapshot = await userRef.orderByChild('email').equalTo(decodedToken.email).once('value');

    if (!snapshot.exists()) {
      console.warn('User not found in database:', decodedToken.email);
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Extract user data and add it to the request object
    const userData = snapshot.val();
    const userId = Object.keys(userData)[0]; // Assuming the user is uniquely identified by email
    req.user.userData = { id: userId, ...userData[userId] };

    // console.log('User data retrieved from database:', req.userData); // For debugging

    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error('Error during authentication or database lookup:', error);
    return res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;