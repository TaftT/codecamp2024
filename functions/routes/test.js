const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware')

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: req.user, // The decoded user information from the ID token
  });
});


module.exports = router;