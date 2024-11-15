const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const authMiddleware = require('../middleware');

router.get("/all", authMiddleware, async (req, res) => {
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
module.exports = router;