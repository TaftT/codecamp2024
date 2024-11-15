const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

const test = require('./routes/test');

// Parse JSON bodies
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000'], // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable setting cookies
};

app.use(cors(corsOptions));

// Use the `/test` route from your test module
app.use('/test', test);

app.route('/').get((req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

// Export the app as a Firebase function
exports.app = functions.https.onRequest(app);