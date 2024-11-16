const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/userRoutes');
const competitionRoutes = require('./routes/competitions');
const entriesRoutes = require('./routes/entries');

// Parse JSON bodies
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:8000',"https://code-camp-showcase.web.app"], // Replace with your allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable setting cookies
};

app.use(cors(corsOptions));

// Use the `/test` route from your test module
app.use('/users', userRoutes);
app.use('/competitions', competitionRoutes);
app.use('/entries', entriesRoutes);

app.route('/').get((req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

// Export the app as a Firebase function
exports.app = functions.https.onRequest(app);