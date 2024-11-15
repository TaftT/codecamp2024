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

router.get("/all", async (req, res) => {
    res.status(201).json({ data: [
        {
            name:"Code Camp 2024 - Industry",
            competitionId:"1gsdfg",
            creatorUserId:"435345",
            description:"Lets win this. Lets win this. Lets win this. Lets win this.",
            FeatureImageUrl:"https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", 
            judgeEmails:["thisTaft@gmail.com","baprice01@gmail.com"],
            passcode:"cool1",
            status:"Open"
        },
        {
            name:"Code Camp 2024 - Day Camp",
            competitionId:"2dfgfhfd",
            creatorUserId:"5646",
            description:"Lets win this. Lets win this. Lets win this. Lets win this.",
            FeatureImageUrl:"https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
            judgeEmails:["thisTaft@gmail.com","baprice01@gmail.com"],
            passcode:"cool2",
            status:"Closed"
        },
        {
            name:"Code Camp 2024 - Student",
            competitionId:"3dfgsdf",
            creatorUserId:"4567456",
            description:"Lets win this. Lets win this. Lets win this. Lets win this.",
            FeatureImageUrl:"https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
            judgeEmails:["thisTaft@gmail.com","baprice01@gmail.com"],
            passcode:"cool3",
            status:"Judging"
        },
        {
            name:"Code Camp 2025 - Student",
            competitionId:"4dfgsdf",
            creatorUserId:"4567sdf456",
            description:"Lets win this. Lets win this. Lets win this. Lets win this.",
            FeatureImageUrl:"https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg", 
            judgeEmails:["thisTaft@gmail.com","baprice01@gmail.com"],
            passcode:"cool4",
            status:"Future"
        }
    ] });
})

// Middleware for authenticating the user
router.put("/new", authMiddleware, async (req, res) => {
  const user = req.user; // This comes from your authMiddleware (user info)
  const creatorUserId = user.uid;
  const name = user.name;
  const description = user.description;
  const FeatureImageUrl = user.FeatureImageUrl;
  const passcode = user.passcode;
  const judgeEmails = req.body.judgeEmails;
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

  const competitionId = uuid()

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