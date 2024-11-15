const express = require('express');
const router = express.Router();


// Define routes for users
router.route("/").get((req, res) => {
    res.status(200).json("test");
});


module.exports = router;