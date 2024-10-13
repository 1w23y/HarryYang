const express = require("express");  // Introduce the Express framework to create a Web application server
const bodyParser = require("body-parser");  // Introduce body-parser middleware to process http requests
const path = require("path");   // Introduce the path to handle file paths

const app = express();    // Create an app Express application instance

// Use the body-parser middleware to parse URL and JSON
app.use(bodyParser.urlencoded({extended:true}));  
app.use(bodyParser.json());

app.use(express.static(__dirname));   // Set the current directory to the static file directory

 app.get("/",(req,res)=>{   //The client accesses the path "/" and sends the index.html file
   res.sendFile(path.join(__dirname,"./home/home.html"));
});

app.listen(2323,()=>{      //Start the server and run it on port 2323
    console.log("Server up and running on port 2323");
});