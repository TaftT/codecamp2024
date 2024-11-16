const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const authMiddleware = require('../middleware');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../service-account-file.json')),
     // Ensure this is correct
  });
} else {
  admin.app(); // If already initialized, use the existing app
}

router.get("/test", async (req, res) => {
  res.status(201).json({ data: "test" });
})

router.get("/self", authMiddleware, async (req, res) => {
  res.status(201).json({ userData: req.user });
})

// Middleware for authenticating the user
router.put("/updateInfo", authMiddleware, async (req, res) => {
  const user = req.user; // This comes from your authMiddleware (user info)
  const email = user.email;
  const username = req.body.username;
  const linkedInURL = req.body.linkedInURL;
  console.log(user)
  // Validate required fields
  if (!email) {
    return res.status(400).json({ error: 'Please provide Email' });
  }
  if (!username) {
    return res.status(400).json({ error: 'Please provide Username.' });
  }
  if (linkedInURL && !linkedInURL.includes("https://www.linkedin.com/")) {
    return res.status(400).json({ error: 'Please include "https://www.linkedin.com/" in your URL.' });
  }

  try {
    // Reference to the users node in Realtime Database
    const usersRef = admin.database().ref('users');

    // Check if user already exists in the database by their email
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

    if (snapshot.exists()) {
      // User exists, update their information
      const userId = Object.keys(snapshot.val())[0]; // Get the userId (key) of the existing user
      const userRef = usersRef.child(userId);
      
      await userRef.update({
        username: username,
        linkedInURL: linkedInURL,
        banned: false, // or whatever status you want to set
      });

      res.status(200).json({ message: 'User info updated successfully' });
    } else {
      // User does not exist, create a new entry
      const newUser = {
        email: email,
        username: username,
        linkedInURL: linkedInURL,
        banned: false, // default value, you can modify later
        profilePicURL: "", // Initially empty, can be updated later
      };

      // Create a new user entry in Realtime Database
      await usersRef.push(newUser);

      res.status(201).json({ message: 'New user created successfully' });
    }
  } catch (error) {
    console.error("Error updating/creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;