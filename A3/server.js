const express = require('express');   // Introduce the Express framework to create a Web application server

const cors = require('cors');    // CORS middleware is introduced to handle cross-domain requests

const app = express();    // Create an app Express application instance

const apiRouter = require('./API/controllerAPI/api_controller');   // Import custom API routes

app.use(cors());  // Use CORS to allow requests from different sources to access the server

// Use the body-parser middleware to parse URL and JSON
app.use(express.urlencoded({extended:true}));  
app.use(express.json());

app.use('/api/Crowdfunding', apiRouter);   // Routes the request for the /api/Crowdfunding path to the incoming apiRouter

app.listen(3060, () => {   //Start the server and run it on port 3060
    console.log('Server up and running on port 3060');
});