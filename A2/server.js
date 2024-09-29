const express = require('express');
const cors = require('cors')
const app = express();
const apiRouter = require('./API/controllerAPI/api_controller'); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/Crowdfunding', apiRouter);

app.listen(3060, () => {
    console.log('Server up and running on port 3060');
});