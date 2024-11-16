const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const authMiddleware = require('../middleware');
const { v4: uuid } = require('uuid'); // Ensure UUID is imported

router.put("/new", authMiddleware, async (req, res) => {
    const user = req.user; // This comes from your authMiddleware (user info)
    const creatorUserId = user.uid;
    const { 
        competitionId, 
        entryName, 
        teamName, 
        entryEmails = [], 
        youTubeUrl, 
        gitHubUrl, 
        categoryEntry, 
        teamNumInput, 
        entryDescription, 
        FeatureImageUrl
    } = req.body;

    // Validate required fields
    if (!competitionId) {
        return res.status(400).json({ error: 'Please provide competitionId.' });
    }
    if (!entryName) {
        return res.status(400).json({ error: 'Please provide Name.' });
    }
    if (!teamName) {
        return res.status(400).json({ error: 'Please provide team Name.' });
    }
    if (!FeatureImageUrl) {
        return res.status(400).json({ error: 'Please provide Feature Image URL.' });
    }
    if (gitHubUrl && !(gitHubUrl.includes("https://github.com/") || gitHubUrl.includes("https://gitlab.com/"))) {
        return res.status(400).json({ error: 'Please include a valid GitHub or GitLab URL.' });
    }
    if (!Array.isArray(entryEmails) || entryEmails.length > 4) {
        return res.status(400).json({ error: 'Teams can only have up to 4 members.' });
    }

    const entryId = uuid();
    const createdDate = new Date().toISOString();

    try {
        const fetchWithTimeout = (ref, timeout = 5000) => {
            return Promise.race([
                ref.once('value'),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase request timed out")), timeout))
            ]);
        };

        // Reference to the competitions node in Realtime Database
        const db = admin.database();
        const competitionRef = db.ref(`competitions/${competitionId}`);

        // Check if the competition exists with timeout
        console.time("competitionFetch");
        const competitionSnapshot = await fetchWithTimeout(competitionRef, 10000);
        console.timeEnd("competitionFetch");

        const competitionData = competitionSnapshot.val();

        if (!competitionData) {
            return res.status(404).json({ error: `Competition with ID ${competitionId} does not exist.` });
        }

        // Reference to the entries node
        const EntryRef = db.ref('entries').child(entryId);

        // Data to save
        const EntryData = {
            competitionId,
            creatorUserId,
            entryId,
            entryName,
            teamName,
            entryEmails,
            youTubeUrl,
            gitHubUrl,
            categoryEntry,
            teamNumInput,
            entryDescription,
            FeatureImageUrl,
            createdDate,
            disqualified: false,
        };

        // Save the Entry data
        console.time("entrySave");
        await EntryRef.set(EntryData);
        console.timeEnd("entrySave");

        res.status(201).json({ message: 'New Entry successfully created', entryId });
    } catch (error) {
        console.error("Error updating/creating Entry:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = router;