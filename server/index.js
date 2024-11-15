const express = require('express');
const cors = require('cors');
const app = express();


const test = require('./routes/test');


// Parse JSON bodies
app.use(express.json());


const corsOptions = {
    origin: ['http://localhost:3000'], // Replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable set cookie
  };
 
app.use(cors(corsOptions));


app.use('/test', test);


app.route("/").get((req, res) => {
    console.log(req.body);
    res.status(200).json(req.body);
})


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
