const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const authMiddleware = require('../middleware');
const { v4: uuid } = require('uuid');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../service-account-file.json')),
     // Ensure this is correct
  });
} else {
  admin.app(); // If already initialized, use the existing app
}

router.get("/byId/:id", async (req, res) => {
  const { id: competitionId } = req.params;

  try {
      // Reference to the competitions node in Realtime Database
      const db = admin.database();
      const competitionRef = db.ref(`competitions/${competitionId}`);
      const entriesRef = db.ref('entries');

      // Fetch competition by ID
      const competitionSnapshot = await competitionRef.once('value');
      const competitionData = competitionSnapshot.val();

      // If competition not found
      if (!competitionData) {
          return res.status(404).json({ error: `Competition with ID ${competitionId} not found.` });
      }

      // Fetch entries with the competitionId
      const entriesSnapshot = await entriesRef.orderByChild('competitionId').equalTo(competitionId).once('value');
      const entriesData = entriesSnapshot.val();

      // Transform entries into an array
      const entries = entriesData
          ? Object.keys(entriesData).map(entryId => ({
                entryId,
                ...entriesData[entryId]
            }))
          : [];

      // Respond with the competition data and its entries
      const responseData = {
          name: competitionData.name,
          competitionId,
          creatorUserId: competitionData.creatorUserId,
          description: competitionData.description,
          FeatureImageUrl: competitionData.FeatureImageUrl,
          status: competitionData.status,
          entries
      };

      res.status(200).json({ data: responseData });
  } catch (error) {
      console.error("Error fetching competition or entries by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/all", async (req, res) => {
  try {
      // Reference to the competitions node in Realtime Database
      const db = admin.database();
      const competitionsRef = db.ref('competitions');

      // Fetch all competitions
      const snapshot = await competitionsRef.once('value');
      const competitionsData = snapshot.val();

      // If there are no competitions
      if (!competitionsData) {
          return res.status(404).json({ message: 'No competitions found' });
      }

      // Transform competitionsData (object) into an array
      const competitionsList = Object.keys(competitionsData).map(key => ({
          id: key,
          ...competitionsData[key]
      }));

      // Return all competitions as a list
      res.status(200).json(competitionsList);
  } catch (error) {
      console.error("Error fetching competitions:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware for authenticating the user
router.put("/new", authMiddleware, async (req, res) => {
    const user = req.user; // This comes from your authMiddleware (user info)
    const creatorUserId = user.uid;
    const { name, description, FeatureImageUrl, passcode } = req.body; // Assuming these come from the request body
    const judgeEmails = req.body.judgeEmails;
  
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Please provide Name' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Please provide Description.' });
    }
    if (!FeatureImageUrl) {
      return res.status(400).json({ error: 'Please provide Feature Image Url.' });
    }
    if (!passcode) {
      return res.status(400).json({ error: 'Please provide Passcode.' });
    }
  
    const competitionId = uuid();
    const createdDate = new Date().toISOString();
    const status = "Future";
  
    try {
      // Reference to the competitions node in Realtime Database
      const db = admin.database();
      const competitionRef = db.ref('competitions').child(competitionId);
  
      // Data to save
      const competitionData = {
        creatorUserId,
        name,
        description,
        FeatureImageUrl,
        passcode,
        judgeEmails: judgeEmails.split(",") || [],
        createdDate,
        status
      };
  
      // Save the competition data
      await competitionRef.set(competitionData);
  
      res.status(201).json({ message: 'New competition successfully created', competitionId });
    } catch (error) {
      console.error("Error updating/creating competition:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;