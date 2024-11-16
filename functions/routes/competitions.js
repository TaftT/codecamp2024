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
    const id = req.params.id;
    res.status(201).json({ data: [
        {
            name:"Code Camp 2024 - Industry",
            competitionId:id,
            creatorUserId:"435345",
            description:"Lets win this. Lets win this. Lets win this. Lets win this.",
            FeatureImageUrl:"https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", 
            status:"Open",
            entries:[{
                entryId:"jkfsdkf",
                group:[{
                    username:"Taft Thompson",
                    linkedInURL:"https://www.linkedin.com/in/taft-thompson-ba6522181/"
                },{
                    username:"Brooklyn Thompson",
                    linkedInURL:"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
                }],
                category:"Webapp",
                name:"Code Camp Showcase", 
                description:"Showcase",
                FeaturedImg:"https://images.pexels.com/photos/38519/macbook-laptop-ipad-apple-38519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                gitURL:"https://github.com/TaftT/codecamp2024", 
                YouTubeURL:"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", 
                location:"H1"
            },
            {
                entryId:"ggdfsg",
                group:[{
                    username:"Taft Thompson",
                    linkedInURL:"https://www.linkedin.com/in/taft-thompson-ba6522181/"
                },{
                    username:"Brooklyn Thompson",
                    linkedInURL:"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
                }],
                category:"Webapp",
                name:"Test 2 Code Camp Showcase", 
                FeatureImageUrl:"https://images.pexels.com/photos/3930068/pexels-photo-3930068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                description:"Showcase",
                gitURL:"https://github.com/TaftT/codecamp2024", 
                YouTubeURL:"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", 
                location:"H1"
            }]
        }
    ] });
})


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
  
      // Return all competitions
      res.status(200).json(competitionsData);
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