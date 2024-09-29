const express = require("express");  
const bodyParser = require("body-parser");
const path = require("path");

const app = express(); 

app.use(bodyParser.urlencoded({extended:true}));  
app.use(bodyParser.json());

app.use(express.static(__dirname));  

app.get("/",(req,res)=>{   
    res.sendFile(path.join(__dirname,"./HomePage/index.html"));
});

app.get("/search",(req,res)=>{   
    res.sendFile(path.join(__dirname,"./SearchPage/search.html"));
});

app.get("/fundraiser",(req,res)=>{   
    res.sendFile(path.join(__dirname,"./FundraiserPage/fundraiser.html"));
});

app.listen(8080,()=>{
    console.log("Server up and running on port 8080");
});